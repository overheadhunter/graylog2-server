/*
 * Copyright (C) 2020 Graylog, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Server Side Public License, version 1,
 * as published by MongoDB, Inc.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Server Side Public License for more details.
 *
 * You should have received a copy of the Server Side Public License
 * along with this program. If not, see
 * <http://www.mongodb.com/licensing/server-side-public-license>.
 */
import React from 'react';
import { render, waitFor } from 'wrappedTestingLibrary';
import { act } from 'react-dom/test-utils';
import suppressConsole from 'helpers/suppressConsole';

import history from 'util/History';
import ErrorsActions from 'actions/errors/ErrorsActions';
import { createReactError, createUnauthorizedError, createNotFoundError } from 'logic/errors/ReportedErrors';
import FetchError from 'logic/errors/FetchError';

import ReportedErrorBoundary from './ReportedErrorBoundary';

jest.mock('routing/withLocation', () => (Component) => (props) => <Component {...props} location={{ pathname: '/' }} />);

describe('ReportedErrorBoundary', () => {
  it('displays child component if there is no error', () => {
    const { getByText } = render(<ReportedErrorBoundary>Hello World!</ReportedErrorBoundary>);

    expect(getByText('Hello World!')).toBeInTheDocument();
  });

  it('displays runtime error page when react error got reported', async () => {
    const { getByText, queryByText } = render(<ReportedErrorBoundary>Hello World!</ReportedErrorBoundary>);

    suppressConsole(() => {
      ErrorsActions.report(createReactError(new Error('The error message'), { componentStack: 'The component stack' }));
    });

    await waitFor(() => expect(queryByText('Hello World!')).not.toBeInTheDocument());

    expect(getByText('Something went wrong.')).toBeInTheDocument();
    expect(getByText('The error message')).toBeInTheDocument();
  });

  it('displays not found page when not found error got reported', async () => {
    const { getByText, queryByText } = render(<ReportedErrorBoundary>Hello World!</ReportedErrorBoundary>);
    const response = { status: 404, body: { message: 'The request error message' } };

    suppressConsole(() => {
      ErrorsActions.report(createNotFoundError(new FetchError('The request error message', response)));
    });

    await waitFor(() => expect(queryByText('Hello World!')).not.toBeInTheDocument());

    expect(getByText('Page not found')).toBeInTheDocument();
    expect(getByText('The party gorilla was just here, but had another party to rock.')).toBeInTheDocument();
  });

  it('displays reported error with an unkown type', async () => {
    const { getByText, queryByText } = render(<ReportedErrorBoundary>Hello World!</ReportedErrorBoundary>);
    const response = { status: 404, body: { message: 'The error message' } };

    suppressConsole(() => {
      ErrorsActions.report({ ...createNotFoundError(new FetchError('The error message', response)), type: 'UnkownReportedError' });
    });

    await waitFor(() => expect(queryByText('Hello World!')).not.toBeInTheDocument());

    expect(getByText('Something went wrong')).toBeInTheDocument();
    expect(getByText(/The error message/)).toBeInTheDocument();
  });

  it('displays unauthorized error page when unauthorized error got reported', async () => {
    const { findByText, queryByText } = render(<ReportedErrorBoundary>Hello World!</ReportedErrorBoundary>);
    const response = { status: 403, body: { message: 'The request error message' } };

    suppressConsole(() => {
      ErrorsActions.report(createUnauthorizedError(new FetchError('The request error message', response)));
    });

    await findByText('Missing Permissions');

    expect(queryByText('Hello World!')).not.toBeInTheDocument();
    expect(queryByText(/The request error message/)).toBeInTheDocument();
  });

  it('resets error when navigation changes', async () => {
    const { getByText } = render(<ReportedErrorBoundary>Hello World!</ReportedErrorBoundary>);
    const response = { status: 403, body: { message: 'The request error message' } };

    expect(getByText('Hello World!')).toBeInTheDocument();

    suppressConsole(() => {
      ErrorsActions.report(createUnauthorizedError(new FetchError('The request error message', response)));
    });

    await waitFor(() => expect(getByText('Missing Permissions')).toBeInTheDocument());

    act(() => history.push('/'));

    await waitFor(() => expect(getByText('Hello World!')).toBeInTheDocument());
  });
});

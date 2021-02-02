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
package org.graylog2.rest.models.users.requests;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.google.auto.value.AutoValue;

import javax.validation.constraints.Email;
import javax.validation.constraints.Min;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AutoValue
@JsonAutoDetect
@JsonDeserialize(builder = CreateUserRequest.Builder.class)
public abstract class CreateUserRequest {

    public static final String USERNAME = "username";
    public static final String PASSWORD = "password";
    public static final String SEND_ACTIVATION = "send_activation";
    public static final String EMAIL = "email";
    public static final String FULL_NAME = "full_name";
    public static final String PERMISSIONS = "permissions";
    public static final String TIMEZONE = "timezone";
    public static final String SESSION_TIMEOUT_MS = "session_timeout_ms";
    public static final String STARTPAGE = "startpage";
    public static final String ROLES = "roles";

    @JsonProperty(PASSWORD)
    public abstract String username();

    @JsonProperty(PASSWORD)
    public abstract Optional<String> password();

    @JsonProperty(SEND_ACTIVATION)
    public abstract Optional<Boolean> sendActivation();

    @JsonProperty(EMAIL)
    public abstract String email();

    @JsonProperty(FULL_NAME)
    public abstract String fullName();

    @JsonProperty(PERMISSIONS)
    public abstract List<String> permissions();

    @JsonProperty(TIMEZONE)
    public abstract Optional<String> timezone();

    @JsonProperty(SESSION_TIMEOUT_MS)
    public abstract Optional<Long> sessionTimeoutMs();

    @JsonProperty(STARTPAGE)
    public abstract Optional<Startpage> startpage();

    @JsonProperty(ROLES)
    public abstract List<String> roles();

    public static Builder builder() {
        return new AutoValue_CreateUserRequest.Builder()
                .roles(new ArrayList<>())
                .sendActivation(false);
    }

    @AutoValue.Builder
    public abstract static class Builder {

        @JsonCreator
        public static Builder create() {
            return new AutoValue_CreateUserRequest.Builder();
        }

        @JsonProperty(USERNAME)
        public abstract Builder username(String username);

        @JsonProperty(PASSWORD)
        public abstract Builder password(String password);

        @JsonProperty(SEND_ACTIVATION)
        public abstract Builder sendActivation(Boolean sendActivation);

        @Email
        @JsonProperty(EMAIL)
        public abstract Builder email(String email);

        @JsonProperty(FULL_NAME)
        public abstract Builder fullName(String fullName);

        @JsonProperty(PERMISSIONS)
        public abstract Builder permissions(List<String> permissions);

        @JsonProperty(TIMEZONE)
        public abstract Builder timezone(String timezone);

        @Min(1)
        @JsonProperty(SESSION_TIMEOUT_MS)
        public abstract Builder sessionTimeoutMs(Long sessionTimeoutMs);

        @JsonProperty(STARTPAGE)
        public abstract Builder startpage(Startpage startpage);

        @JsonProperty(ROLES)
        public abstract Builder roles(List<String> roles);

        public abstract CreateUserRequest build();
    }
}

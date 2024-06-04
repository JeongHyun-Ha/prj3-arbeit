package com.backend.domain.alba;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AlbaEditForm {

    @Email
    @NotBlank
    private String email;
    private String password;
    private String passwordCheck;
    @NotBlank
    private String name;
    @NotBlank
    private String address;
    @NotBlank
    private String phone;
}
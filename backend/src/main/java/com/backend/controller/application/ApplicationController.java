package com.backend.controller.application;

import com.backend.config.AuthId;
import com.backend.domain.application.ApplicationWriteForm;
import com.backend.service.application.ApplicationService;
import com.backend.service.resume.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('SCOPE_ALBA')")
@RestController
@RequestMapping("/api")
public class ApplicationController {
    private final ApplicationService service;
    private final ResumeService resumeService;

    @GetMapping("/jobs/{jobsId}/apply")
    public Map<String, Object> loadApplicationData(@PathVariable Integer jobsId, @AuthId Integer authId) {
        return service.findResumesAndJobsTitle(jobsId, authId);
    }

    @PostMapping("/jobs/{jobsId}/apply")
    public ResponseEntity write(@Validated @RequestBody ApplicationWriteForm form, BindingResult bindingResult,
                                @PathVariable Integer jobsId,
                                @AuthId Integer authId) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.badRequest().body(errors);
        }

        service.write(form, jobsId, authId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{jobsId}/apply-validate")
    public ResponseEntity duplicationValidate(@PathVariable Integer jobsId, @AuthId Integer authId) {
        if (!service.duplicationValidate(jobsId, authId)) {
            return ResponseEntity.badRequest().body("같은 공고를 여러번 신청할 수 없습니다.");
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/applications-count")
    public Integer applicationCount(@AuthId Integer authId) {
        return service.count(authId);
    }

    @GetMapping("/apply/list")
    public Map<String, Object> list(@AuthId Integer authId, Integer currentPage, String selectedType) {
        return service.findAllByAuthId(currentPage, selectedType, authId);
    }

    @PostMapping("/resume/application-view")
    public ResponseEntity resumeInfo(@RequestParam String resumeId) {
        Map<String, String> result = resumeService.findMemberNameAndTitleById(Integer.valueOf(resumeId));
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/apply/{jobsId}")
    public ResponseEntity cancel(@PathVariable Integer jobsId, @AuthId Integer authId) {
        return service.cancel(jobsId, authId);
    }

    private static Map<String, String> getErrorMessages(BindingResult bindingResult) {
        Map<String, String> errors = new ConcurrentHashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return errors;
    }
}

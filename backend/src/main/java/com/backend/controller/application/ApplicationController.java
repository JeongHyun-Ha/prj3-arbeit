package com.backend.controller.application;

import com.backend.domain.application.Application;
import com.backend.domain.application.ApplicationWriteForm;
import com.backend.service.application.ApplicationService;
import com.backend.service.management.ManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ApplicationController {
    private final ApplicationService service;
    private final ManagementService managementService;

    @GetMapping("/jobs/{jobsId}/apply")
    @PreAuthorize("hasAuthority('SCOPE_ALBA')")
    public ResponseEntity loadApplicationData(@PathVariable Integer jobsId, @AuthId Integer authId) {
        return service.findResumesAndJobsData(jobsId, authId);
    }

    @PostMapping("/jobs/{jobsId}/apply")
    @PreAuthorize("hasAuthority('SCOPE_ALBA')")
    public ResponseEntity write(@Validated @RequestBody ApplicationWriteForm form, BindingResult bindingResult,
                                @AuthId Integer authId) {

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("빈칸 없이 입력해주세요.");
        }

        service.write(form, authId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/apply-validate")
    @PreAuthorize("hasAuthority('SCOPE_ALBA')")
    public ResponseEntity duplicationValidate(@RequestParam Integer jobsId, @AuthId Integer authId) {
        if (!service.duplicationValidate(jobsId, authId)) {
            return ResponseEntity.badRequest().body("같은 공고를 여러번 신청할 수 없습니다.");
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/applications-count")
    @PreAuthorize("hasAuthority('SCOPE_ALBA')")
    public Integer applicationCount(@AuthId Integer authId) {
        return service.count(authId);
    }

    @GetMapping("/{jobsId}/apply/select")
    public Application view(@PathVariable Integer jobsId, @AuthId Integer authId) {
        Application application = service.findByJobsIdAndMemberId(jobsId, authId);
        return application;
    }

    @GetMapping("/apply/list")
    public List<Application> list(@AuthId Integer authId) {
        return service.findAllByAuthId(authId);
    }

    @DeleteMapping("/apply/{jobsId}")
    @PreAuthorize("hasAuthority('SCOPE_ALBA')")
    public ResponseEntity cancel(@PathVariable Integer jobsId, @AuthId Integer authId) {
        return service.cancel(jobsId, authId);
    }
}

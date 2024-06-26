package com.backend.service.application;

import com.backend.domain.application.Application;
import com.backend.domain.application.ApplicationWriteForm;
import com.backend.domain.jobs.Jobs;
import com.backend.domain.resume.Resume;
import com.backend.mapper.application.ApplicationMapper;
import com.backend.mapper.jobs.JobsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationMapper mapper;
    private final JobsMapper jobsMapper;

    public ResponseEntity findResumesAndJobsData(Integer jobsId, Integer authId) {
        Map<String, Object> result = new HashMap<>();

        List<Resume> resumes = mapper.selectResumeByMemberId(authId);
        Jobs jobs = jobsMapper.selectById(jobsId);
        LocalDateTime deadline = jobs.getDeadline();
        LocalDateTime now = LocalDateTime.now();

        if (resumes != null && jobs != null && now.isBefore(deadline)) {
            Map<String, Object> jobsMap = new HashMap<>();
            jobsMap.put("jobsTitle", jobs.getTitle());
            jobsMap.put("deadline", jobs.getDeadline());

            result.put("resumes", resumes);
            result.put("jobsMap", jobsMap);

            return ResponseEntity.ok().body(result);
        }
        return ResponseEntity.status(404).build();
    }

    public void write(ApplicationWriteForm form, Integer authId) {
        Application application = new Application(
                form.getJobsId(),
                authId,
                form.getResumeId(),
                form.getTitle(),
                form.getComment(),
                null, null, null
        );
        mapper.insert(application);
    }

    public List<Application> findAllByAuthId(Integer memberId) {
        return mapper.list(memberId);
    }

    public Application findByJobsIdAndMemberId(Integer jobsId, Integer memberId) {
        return mapper.selectByJobsIdAndMemberId(jobsId, memberId);
    }

    public void update(Application application) {
        mapper.update(application);
    }

    public ResponseEntity cancel(Integer jobsId, Integer authId) {
        Application application = mapper.selectByJobsIdAndMemberId(jobsId, authId);
        if(application.getIsPassed() == 1){
            return ResponseEntity.badRequest().body("합격 처리된 지원서는 취소할 수 없습니다.");
        }
        mapper.deleteByJobsIdAndMemberId(jobsId, authId);
        return ResponseEntity.ok().build();
    }

    public void deleteAllByJobsId(Integer jobsId) {
        // 사장이 공고를 삭제하는 경우 해당공고의 알바 지원내역 모두 삭제
        mapper.deleteAllByJobsId(jobsId);
    }

    public boolean duplicationValidate(Integer jobsId, Integer authId) {
        Application application = mapper.selectByJobsIdAndMemberId(jobsId, authId);
        return application == null;
    }

    public Integer count(Integer authId) {
        return mapper.selectCountByMemberId(authId);
    }


}

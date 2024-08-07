package com.backend.service.scrap;

import com.backend.config.AuthId;
import com.backend.domain.scrap.Scrap;
import com.backend.mapper.scrap.ScrapMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ScrapService {
    private final ScrapMapper mapper;

    public void insert(Scrap scarp) {
        mapper.insert(scarp);
    }

    public List<Scrap> list(Integer memberId) {
        List<Scrap> scraps = mapper.selectByMemberId(memberId);
//        List<Scrap> scraps1 = mapper.selectAll();
        return scraps;
    }

    public void delete(Integer id) {
        mapper.delete(id);
    }

    public void deleteByJobsId(Integer jobsId) {
        mapper.deleteByJobsId(jobsId);
    }

    public void update(Scrap scarp) {
        mapper.update(scarp);
    }

    public Integer count(@AuthId Integer memberId) {
        return mapper.count(memberId);
    }
}

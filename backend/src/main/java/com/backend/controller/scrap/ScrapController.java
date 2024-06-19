package com.backend.controller.scrap;

import com.backend.controller.application.MemberId;
import com.backend.domain.scrap.Scrap;
import com.backend.service.scrap.ScrapService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scrap")
@RequiredArgsConstructor
public class ScrapController {
    private final ScrapService service;

    @PostMapping
    public void insert(@RequestBody Scrap scarp) {
        service.insert(scarp);
    }

    @GetMapping("list")
    public List<Scrap> list(@MemberId Integer memberId) {
        return service.list(memberId);
    }

    @PutMapping()
    public void update(@RequestBody Scrap scarp) {
        service.update(scarp);
    }

    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
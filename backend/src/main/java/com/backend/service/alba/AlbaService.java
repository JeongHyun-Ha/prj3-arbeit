package com.backend.service.alba;

import com.backend.domain.alba.Alba;
import com.backend.domain.alba.AlbaEditForm;
import com.backend.domain.alba.AlbaLoginForm;
import com.backend.domain.alba.AlbaSignupForm;
import com.backend.mapper.alba.AlbaMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class AlbaService {

    private final AlbaMapper mapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtEncoder encoder;

    public void signup(AlbaSignupForm form) {
        form.setPassword(passwordEncoder.encode(form.getPassword()));
        mapper.insert(form);
    }

    public Map<String, Object> getToken(AlbaLoginForm form) {
        Map<String, Object> result = null;

        Alba dbAlba = mapper.selectByEmail(form.getEmail());
        if (dbAlba != null) {
            if (passwordEncoder.matches(form.getPassword(), dbAlba.getPassword())) {
                result = new HashMap<>();
                String token = "";
                Instant now = Instant.now();

                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self")
                        .issuedAt(now)
                        .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                        .subject(dbAlba.getId().toString())
//                        .claim("name", dbAlba.getName())
                        .build();

                token = encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

                result.put("token", token);
            }
        }

        return result;
    }

    public Alba findById(Integer id) {
        Alba alba = mapper.selectById(id);
        alba.setPassword("");
        return alba;
    }

    public void edit(AlbaEditForm form, Authentication authentication) {
        Alba alba = new Alba(Integer.valueOf(
                authentication.getName()), form.getEmail(), form.getPassword(),
                form.getName(), form.getAddress(), form.getPhone(), null);
        mapper.updateById(alba);
    }

    public List<Alba> findAll() {
        return mapper.selectAll();
    }

    public boolean hasAccess(Integer id, Authentication authentication) {
        Integer loginId = Integer.valueOf(authentication.getName());
        if (!id.equals(loginId)) {
            return false;
        }
        return true;
    }

    public void deleteById(Integer id) {
        mapper.deleteById(id);
    }
}
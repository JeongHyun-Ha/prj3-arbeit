package com.backend.mapper.application;

import com.backend.domain.application.Application;
import com.backend.domain.jobs.Jobs;
import com.backend.domain.resume.Resume;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ApplicationMapper {
    @Select("""
            SELECT * FROM resume
            WHERE member_id = #{memberId};
            """)
    List<Resume> selectResumeByMemberId(Integer memberId);

    @Insert("""
            INSERT INTO application
            (jobs_id, member_id, resume_id, title, comment, is_passed)
            VALUES
            (#{jobsId},#{memberId},#{resumeId},#{title},#{comment},#{isPassed})
            """)
    int insert(Application application);

    @Select("""
            SELECT * FROM jobs
            WHERE id = #{jobsId}
            """)
    Jobs selectJobsByJobsId(Integer jobsId);

    @Select("""
            SELECT a.*,j.title AS jobsTitle
            FROM application a
            JOIN jobs j ON a.jobs_id = j.id
            WHERE a.member_id = #{memberId}
            """)
    List<Application> list(Integer memberId);

    @Select("""
            SELECT a.*,j.title AS jobsTitle
            FROM application a
            JOIN jobs j ON a.jobs_id = j.id
            WHERE
            a.jobs_id = #{jobsId} AND a.member_id = #{memberId}
            """)
    Application selectByJobsIdAndMemberId(Integer jobsId, Integer memberId);


    @Delete("""
            DELETE FROM application
            WHERE jobs_id = #{jobsId} AND member_id = #{memberId}
            """)
    int deleteByJobsIdAndMemberId(Integer jobsId, Integer memberId);

    @Update("""
            UPDATE application SET
            resume_id = #{resumeId},
            title = #{title},
            comment = #{comment},
            is_passed = #{isPassed}
            WHERE jobs_id = #{jobsId} AND member_id = #{memberId}
            """)
    int update(Application application);


    @Delete("""
            DELETE FROM application
            WHERE jobs_id = #{jobsId}
            """)
    int deleteAllByJobsId(Integer jobsId);

    @Select("""
            SELECT COUNT(*)
            FROM application
            WHERE member_id=#{memberId}
            """)
    Integer selectCountByMemberId(Integer memberId);

}

# 240613 기준
DROP TABLE jobs_condition;
CREATE TABLE jobs_condition
(
    jobs_Id          INT PRIMARY KEY REFERENCES jobs (id),
    education        VARCHAR(50)  NOT NULL,
    education_detail VARCHAR(50)  NOT NULL,
    age              INT          NOT NULL,
    preferred        VARCHAR(200) NOT NULL,
    work_period      VARCHAR(100) NOT NULL,
    work_week        VARCHAR(45)  NOT NULL,
    work_time        VARCHAR(45)  NOT NULL
);
SELECT *
FROM jobs_condition;


SELECT *
FROM jobs;



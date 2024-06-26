import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../provider/LoginProvider.jsx";

export function ApplicationWrite() {
  const { id } = useParams();
  const account = useContext(LoginContext);
  const [application, setApplication] = useState({});
  const [jobsTitle, setJobsTitle] = useState("");
  const [resumeList, setResumeList] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  // Create
  function handleSubmitApply() {
    const confirm = window.confirm(
      "신청하시겠습니까? 한 번 신청하면 수정할 수 없습니다.",
    );

    if (confirm) {
      axios
        .post(`/api/jobs/${id}/apply`, application)
        .then(() => {
          toast({
            status: "success",
            description: "신청되었습니다.",
            position: "top",
          });
          navigate("/jobs/list");
        })
        .catch((err) => {
          alert(err.response.data);
        });
    }
  }

  // Read (자기 resume 리스트 받기)
  useEffect(() => {
    axios
      .get("/api/only-login")
      .then(() => {
        axios
          .get(`/api/jobs/${id}/apply`)
          .then((res) => {
            setJobsTitle(res.data.jobsTitle);
            setResumeList(res.data.resumes);
          })
          .catch((err) => {
            if (err.response.status === 403) {
              navigate("/");
            }
            if (err.response.status === 404) {
              navigate("/jobs/list");
            }
          });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [account.id, id, application.resumeId]);

  const handleInputChange = (field) => (e) => {
    setApplication((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleResumeChange = (e) => {
    const selectedResumeId = e.target.value;
    const selectedResume = resumeList.find(
      (resume) => resume.id === parseInt(selectedResumeId),
    );
    setApplication((prev) => ({
      ...prev,
      jobsId: id,
      resumeId: selectedResumeId,
      title: selectedResume.title,
      comment: selectedResume.content,
    }));
  };

  return (
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Heading mb={"10px"} p={1}>
        지원서 작성
      </Heading>
      <Divider mb={"40px"} borderWidth={"2px"} />
      <Center>
        <FormControl>
          <FormLabel fontSize={"3xl"}>공고 제목</FormLabel>
          <Input value={jobsTitle} readOnly />
          <Divider my={2} />
          <FormLabel fontSize={"3xl"}>이력서 첨부</FormLabel>
          <Select
            defaultValue={application.resumeId}
            placeholder={"이력서를 선택해주세요."}
            onChange={handleResumeChange}
          >
            {resumeList.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.title}
              </option>
            ))}
          </Select>
          <Divider my={2} />
          <FormLabel fontSize={"3xl"}>지원메세지</FormLabel>
          <Textarea
            h={"300px"}
            value={application.comment || ""}
            onChange={handleInputChange("comment")}
          />
          <Button onClick={handleSubmitApply}>지원하기</Button>
        </FormControl>
      </Center>
    </Box>
  );
}

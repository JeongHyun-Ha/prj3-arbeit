import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  Tab,
  TabList,
  Tabs,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

const styles = {
  title: {
    w: "90px",
    fontSize: "md",
    fontWeight: "bold",
    mr: "20px",
  },
};

export function ResumeEdit() {
  const { id } = useParams();
  const [resume, setResume] = useState({});
  const [errors, setErrors] = useState({});
  const [nowAge, setNowAge] = useState("");
  const [profileSrc, setProfileSrc] = useState("");
  const initialIndex = resume.isRookie === 1 ? 0 : 1;
  const [checkLength, setCheckLength] = useState({});

  const navigate = useNavigate();
  const toast = useToast();

  const account = useContext(LoginContext);

  const isError = (prop) => prop !== undefined;

  useEffect(() => {
    axios
      .get("/api/only-alba")
      .then(() => {
        axios
          .get(`/api/resume/${id}`)
          .then((res) => {
            setResume(res.data.resume);
          })
          .catch((err) => {
            if (err.response.status === 404 || err.response.status === 403) {
              toast({
                status: "warning",
                description: "접근 권한이 없습니다.",
                position: "top",
              });
              navigate("/resume/list");
            }
          });
        if (resume.memberId !== undefined) {
          getProfilePicture();
        }
        if (resume) {
          countNowAge();
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
        if (err.response.status === 403) {
          navigate("/");
        }
      });
  }, [resume.memberId]);

  function getProfilePicture() {
    axios
      .get(`/api/profile/${resume.memberId}`)
      .then((res) => {
        setProfileSrc(res.data);
      })
      .catch(() =>
        toast({
          status: "error",
          description: "내부 오류 발생",
          position: "top",
        }),
      );
  }

  function handleRookieBtn(prop) {
    setResume({ ...resume, isRookie: prop });
  }

  const handleInputChange = (prop) => (e) => {
    setResume({ ...resume, [prop]: e.target.value });
    setCheckLength({ ...checkLength, [prop]: e.target.value.length });
  };

  //  핸드폰 번호 - 붙여서 보여주기 (실제론 아님)
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 8) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  // Update
  function handleSaveBtn() {
    const confirm = window.confirm("수정하시겠습니까?");
    if (confirm) {
      axios
        .put(`/api/resume/${id}`, {
          title: resume.title,
          content: resume.content,
          isRookie: resume.isRookie,
        })
        .then(() => {
          toast({
            status: "success",
            description: "수정 완료",
            position: "top",
          });
          navigate(`/resume/${id}`);
        })
        .catch((err) => {
          setErrors(err.response.data);
        });
    }
  }

  // 나이 계산
  const countNowAge = () => {
    const currentTime = Date.now();
    const birthTime = new Date(resume.birthDate).getTime();
    const ageInMilliseconds = currentTime - birthTime;
    const ageInYears = Math.floor(
      ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25),
    ); // 윤년을 고려하여 365.25로 나눔
    setNowAge(ageInYears);
  };

  return (
    <>
      {account.isAlba() && (
        <Box w="full" maxW="70%" mx="auto" p={5} lineHeight="30px">
          <Helmet>
            <title>이력서 수정 - 알바커넥터</title>
          </Helmet>
          <Box
            h={"70px"}
            mb={"70px"}
            bgGradient="linear(to-r, orange.500, orange.300)"
            color={"white"}
            borderTopRadius={"10px"}
          >
            <Heading
              size={"lg"}
              textAlign={"center"}
              lineHeight={"70px"}
              fontFamily={"SBAggroB"}
            >
              이력서 수정
            </Heading>
          </Box>
          <Box>
            <Box>
              <Center>
                <Box w={"150px"} h={"150px"}>
                  <Image
                    w={"100%"}
                    h={"100%"}
                    border={"1px solid gray"}
                    borderRadius={"50%"}
                    src={
                      profileSrc === ""
                        ? "/public/base_profile.png"
                        : profileSrc
                    }
                    objectFit={"contain"}
                  />
                </Box>
                <Box
                  w={"50%"}
                  ml={"50px"}
                  lineHeight={"30px"}
                  fontSize={"15px"}
                >
                  <Box display={"flex"}>
                    <Box {...styles.title}>이름</Box>
                    <Box>{account.name}</Box>
                  </Box>

                  <Box display={"flex"}>
                    <Box {...styles.title}>생년월일</Box>
                    <Box>
                      {resume.birthDate} (만 {nowAge}세)
                    </Box>
                  </Box>

                  <Box display={"flex"}>
                    <Box {...styles.title}>성별</Box>
                    <Box>{resume.gender === "MALE" ? "남성" : "여성"}</Box>
                  </Box>

                  <Box display={"flex"}>
                    <Box {...styles.title}>연락처</Box>
                    <Box>{formatPhoneNumber(resume.phone)}</Box>
                  </Box>

                  <Box display={"flex"}>
                    <Box {...styles.title}>이메일</Box>
                    <Box>{resume.email}</Box>
                  </Box>
                </Box>
              </Center>
              <Box h={"3px"} bg={"#E0E0E0"} mt={"40px"} />
              <FormControl mb={10} isInvalid={isError(errors.title)}>
                <FormLabel
                  w={"100px"}
                  fontSize={"xl"}
                  fontWeight={"bold"}
                  mt={8}
                >
                  제목
                </FormLabel>
                <Input
                  placeholder="제목을 입력해주세요."
                  defaultValue={resume.title}
                  onChange={handleInputChange("title")}
                  h={"50px"}
                />
                <Flex gap={"10px"}>
                  {errors && (
                    <FormErrorMessage>{errors.title}</FormErrorMessage>
                  )}
                  <FormHelperText color={"gray"}>
                    {checkLength.title}/50
                  </FormHelperText>
                </Flex>
              </FormControl>
              <FormControl mb={4}>
                <Flex>
                  <FormLabel
                    fontSize={"xl"}
                    fontWeight={"bold"}
                    h={"40px"}
                    lineHeight={"40px"}
                  >
                    경력
                  </FormLabel>
                  <Tabs index={initialIndex}>
                    <TabList>
                      <Tab
                        onClick={() => handleRookieBtn(1)}
                        w={"70px"}
                        h={"40px"}
                        border={"1px solid lightgray"}
                      >
                        신입
                      </Tab>
                      <Tab
                        onClick={() => handleRookieBtn(0)}
                        w={"70px"}
                        h={"40px"}
                        border={"1px solid lightgray"}
                      >
                        경력
                      </Tab>
                    </TabList>
                  </Tabs>
                </Flex>
              </FormControl>
              <FormControl isInvalid={isError(errors.content)} mb={10}>
                <FormLabel mt={8} fontSize={"xl"} fontWeight={"bold"}>
                  자기 소개
                </FormLabel>
                <Textarea
                  placeholder="자기소개를 써주세요."
                  defaultValue={resume.content}
                  onChange={handleInputChange("content")}
                  h={"150px"}
                />
                <Flex gap={"10px"}>
                  {errors && (
                    <FormHelperText color="red.500">
                      {errors.content}
                    </FormHelperText>
                  )}
                  <FormHelperText color={"gray"}>
                    {checkLength.content}/3,000
                  </FormHelperText>
                </Flex>
              </FormControl>
              <Button
                onClick={handleSaveBtn}
                bgColor={"#FF7F3E"}
                color={"white"}
                w="100%"
                h={"50px"}
              >
                이력서 수정
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

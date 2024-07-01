import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faEye,
  faEyeSlash,
  faKey,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

export function MemberInfo() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [profileSrc, setProfileSrc] = useState("");
  const [nowAge, setNowAge] = useState("");
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [score, setScore] = useState("");

  const fileInputRef = useRef({});
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleClick = () => setShow(!show);
  const account = useContext(LoginContext);

  const isMatch = password === passwordCheck;

  function getProfilePicture() {
    axios
      .get(`/api/profile/${id}`)
      .then((res) => {
        setProfileSrc(res.data);
      })
      .catch(() =>
        toast({
          status: "error",
          description: "내부 오류 발생",
          position: "top",
        }),
      )
      .finally();
  }

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((res) => {
        setMember(res.data);
        if (res.data && member != null) {
          countNowAge(res.data.birthDate);
        }
      })
      .catch(() => {
        navigate("/login");
      });
    getProfilePicture();
  }, [id, toast, navigate]);

  useEffect(() => {
    if (member) {
      if (member && account !== "" && account.isAlba()) {
        axios.get(`/api/member/${id}/alba-score`).then((res) => {
          setScore(res.data);
        });
      }
    }
  }, [member, account, id]);

  function handleRemoveBtn() {
    const confirm = window.confirm("정말 탈퇴하시겠습니까?");
    if (confirm) {
      const params = new URLSearchParams();
      params.append("password", password);
      axios
        .post(`/api/member/${id}/delete`, params)
        .then(() => {
          toast({
            status: "warning",
            description: "탈퇴되었습니다.",
            position: "top",
          });
          account.logout();
          navigate("/login");
        })
        .catch((err) => {
          if (err.response.status === 403) {
            toast({
              status: "warning",
              description: "비밀번호가 일치하지 않습니다.",
              position: "top",
            });
            navigate(`/member/${id}`);
          }
        });
    }
    onClose();
  }

  if (member === null) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  function handleProfilePictureBtn() {
    fileInputRef.current.click();
  }

  const handleFileChange = (event) => {
    const files = event.target.files;
    axios.postForm("/api/profile/register", { files, id }).then(() => {
      getProfilePicture();
    });
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

  // 나이 계산
  const countNowAge = (birthDate) => {
    if (birthDate != null) {
      const currentTime = Date.now();
      const birthTime = new Date(birthDate).getTime();
      const ageInMilliseconds = currentTime - birthTime;
      const ageInYears = Math.floor(
        ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25),
      ); // 윤년을 고려하여 365.25로 나눔
      setNowAge(ageInYears);
    }
  };

  return (
    <Box w="full" maxW="65%" mx="auto" p={3} bgColor={"#f9fbfc"}>
      <Box bg={"#ffffff"} borderRadius={"10px"} p={2}>
        <Box>
          <Box
            h={"70px"}
            mb={"40px"}
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
              마이 페이지
            </Heading>
          </Box>
          <Box>
            <Box>
              {/* 프로필 사진 */}
              <FormControl mb={"50px"}>
                <Flex>
                  <Box w={"240px"} h={"230px"}>
                    <Image
                      mt={"20px"}
                      ml={"70px"}
                      w={"150px"}
                      h={"150px"}
                      border={"1px solid gray"}
                      borderRadius={"50%"}
                      src={
                        profileSrc === ""
                          ? "/public/base_profile.png"
                          : profileSrc
                      }
                      objectFit={"contain"}
                    />

                    {account.hasAccess(id) && (
                      <Box w={"50px"} h={"50px"} mt={"-30px"} ml={"42px"}>
                        <Center
                          boxSize={"50px"}
                          bgColor="gray.100"
                          borderRadius={100}
                          cursor="pointer"
                          onClick={handleProfilePictureBtn}
                        >
                          <FontAwesomeIcon icon={faCamera} fontSize={"25px"} />
                        </Center>
                        <Input
                          w={"50px"}
                          type={"file"}
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                      </Box>
                    )}
                    <Box
                      w={"100%"}
                      display={"flex"}
                      ml={"30px"}
                      mt={"10px"}
                      fontSize={"xl"}
                      fontWeight={"bold"}
                      justifyContent={"center"}
                    >
                      {member.name}
                    </Box>
                    {account.isAlba() && (
                      <Box
                        display={"flex"}
                        ml={"50px"}
                        p={"10px"}
                        fontSize={"xl"}
                        fontWeight={"bold"}
                        justifyContent={"center"}
                      >
                        <Box w={"100px"}>알바점수</Box>
                        <Box>
                          <FontAwesomeIcon icon={faStar} color={"#F5C903"} />
                          {score}
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <Box
                    borderRadius={"15px"}
                    w={"60%"}
                    ml={"50px"}
                    display={"flex"}
                    flexDirection={"column"}
                    gap={"10px"}
                    lineHeight={"30px"}
                  >
                    <Box mb={"20px"}></Box>
                    <Box display={"flex"} p={"6px"} ml={"20px"}>
                      <Box w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                        이름
                      </Box>
                      <Box>{member.name}</Box>
                    </Box>
                    <Divider
                      ml={"5%"}
                      w={"90%"}
                      borderColor={"#eaeaea"}
                      borderWidth={"1px"}
                    />

                    <Box display={"flex"} p={"6px"} ml={"20px"}>
                      <Box w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                        생년월일
                      </Box>
                      <Box>{member.birthDate}</Box>
                      <Box ml={"5px"}>
                        (만 {nowAge ? nowAge : countNowAge(member.birthDate)}세)
                      </Box>
                    </Box>

                    <Box display={"flex"} p={"6px"} ml={"20px"}>
                      <Box w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                        성별
                      </Box>
                      <Box>{member.gender === "MALE" ? "남성" : "여성"}</Box>
                    </Box>

                    <Box display={"flex"} p={"6px"} ml={"20px"} mb={"10px"}>
                      <Box w={"100px"} fontSize={"xl"} fontWeight={"bold"}>
                        전화번호
                      </Box>
                      <Box>{formatPhoneNumber(member.phone)}</Box>
                    </Box>
                  </Box>
                </Flex>
              </FormControl>
              {/* 회원 정보 */}
              <FormControl>
                <Flex w={"100%"} my={5} gap={"20px"} ml={"10px"}>
                  <FormLabel fontSize={"xl"} w={"70px"} fontWeight={"bold"}>
                    이메일
                  </FormLabel>
                  <Box>{member.email}</Box>
                </Flex>
                <Flex w={"100%"} mb={4} gap={"20px"} ml={"10px"}>
                  <FormLabel fontSize={"xl"} w={"70px"} fontWeight={"bold"}>
                    주소
                  </FormLabel>
                  <Box>{member.address}</Box>
                </Flex>

                <Box my={10}>
                  {account.hasAccess(id) && (
                    <Flex gap={"10px"} my={"20px"}>
                      <Button
                        w={"50%"}
                        bgColor={"#FF7F3E"}
                        color={"white"}
                        onClick={() => navigate(`/member/${id}/edit`)}
                      >
                        회원 수정
                      </Button>
                      <Button
                        w={"50%"}
                        bgColor={"red.500"}
                        color={"white"}
                        onClick={onOpen}
                      >
                        회원 탈퇴
                      </Button>
                    </Flex>
                  )}
                </Box>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>회원 삭제</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={"5px"} isInvalid={!isMatch}>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color={"gray.400"}>
                  <FontAwesomeIcon icon={faKey} />
                </InputLeftElement>
                <Input
                  type={show ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    ) : (
                      <FontAwesomeIcon icon={faEye} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isInvalid={!isMatch}>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color={"gray.400"}>
                  <FontAwesomeIcon icon={faKey} />
                </InputLeftElement>
                <Input
                  type={show ? "text" : "password"}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                  placeholder="비밀번호 확인"
                />
              </InputGroup>
              <FormErrorMessage>
                비밀번호와 비밀번호 확인이 일치하지 않습니다.
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              취소
            </Button>
            <Button
              isDisabled={!isMatch}
              colorScheme={"red"}
              variant="outline"
              onClick={handleRemoveBtn}
            >
              회원 삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

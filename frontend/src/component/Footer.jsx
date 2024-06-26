import { Box, Flex, Select, Text, useMediaQuery } from "@chakra-ui/react";

function handleFamilySitesClick() {
  const familysite = {
    잡코리아: "www.jobskorea.co.kr",
    알바몬: "www.albamon.co.kr",
    알바천국: "www.albaheaven.co.kr",
  };
}

export function Footer() {
  const [isNeedResize] = useMediaQuery("(max-width: 1050px)");
  const footerList = [
    "회사소개",
    "이용약관",
    "개인정보처리방침",
    "위치기반서비스이용약관",
    "이메일무단수집거부",
    "제휴및광고문의",
    "캠페인",
    "모바일",
  ];

  return (
    <Box h={"200px"} bg={"transparent"}>
      <Box
        w={"full"}
        // my={"20px"}
        borderY={"2px solid lightgray"}
        display={"flex"}
        justifyContent={"center"}
      >
        <Flex
          w={"1050px"}
          h={"70px"}
          justifyContent={"space-between"}
          cursor={"pointer"}
        >
          <Box display={"flex"} alignItems={"center"} gap={"20px"} p={5}>
            {footerList.map((item, index) => (
              <Text key={index} fontSize={isNeedResize ? "15px" : "medium"}>
                {item}
              </Text>
            ))}
          </Box>

          <Box lineHeight={"70px"}>
            <Select
              fontSize={"sm"}
              color={"gray.500"}
              border={"2px solid lightgray"}
            >
              <option>Family Site</option>
              <option onClick={handleFamilySitesClick}>잡코리아</option>
              <option onClick={handleFamilySitesClick}>알바몬</option>
              <option onClick={handleFamilySitesClick}>알바천국</option>
            </Select>
          </Box>
        </Flex>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"} // 수정 부분
        flexDirection={"column"}
      >
        <Box w={"1050px"} mt={"10px"} ml={10} textAlign={"center"}>
          <Text fontWeight={"bold"}>AlbaConnector</Text>
        </Box>
        <Box display={"flex"} gap={"10px"} fontSize={"sm"}>
          <Text>대표 : 홍길동 | </Text>
          <Text> 사업자등록번호 : 123-45-67890</Text>
          <Text>주소 : 서울 마포구 신촌로 176 중앙빌딩 5층 | </Text>
          <Text> 사업자정보확인</Text>
        </Box>
        <Box display={"flex"} gap={"10px"} fontSize={"sm"}>
          <Text> 통신판매업 신고번호 : 2024-서울서초-1234호 ㅣ </Text>
          <Text> 직업정보제공사업 신고번호 : 서울청 제2024호-00호 ㅣ </Text>
          <Text> 유료직업소개업 등록번호 : 제2024-1234567-89-0-12345호 </Text>
        </Box>
        <Text fontSize={"sm"}>Ⓒ AlbaConnector LLC. All rights reserved.</Text>
      </Box>
    </Box>
  );
}

import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { LoginContext } from "./LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ScrapHistory(props) {
  const account = useContext(LoginContext);
  const [scrapList, setScrapList] = useState([]);
  const navigate = useNavigate();
  const [post, setPost] = useState(false);
  useEffect(() => {
    axios
      .get("/api/scrap/list")
      .then((res) => {
        // favorite 상태가 true인 항목만 필터링
        const filteredScrapList = res.data.filter(
          (item) => item.favorite === true,
        );
        setScrapList(filteredScrapList);
      })
      .catch()
      .finally();
  }, [account.recentJobPages, post]);

  function handleDelete(id) {
    axios.delete(`/api/scrap/delete/${id}`).then(() => {
      setPost(!post);
    });
  }

  return (
    <Box w="full" maxW="70%" mx="auto" p={5} h={"600px"}>
      <Heading borderBottom={"2px solid gray"} mb={"10px"}>
        스크랩한 공고
      </Heading>
      {scrapList.length === 0 && <Box>스크랩한 공고가 없습니다.</Box>}
      {scrapList.length === 0 || (
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>제목</Th>
              </Tr>
            </Thead>
            <Tbody>
              {scrapList.map((item, index) => (
                <Tr
                  key={index}
                  cursor={"pointer"}
                  _hover={{ bgColor: "gray.100" }}
                >
                  <Td>{index + 1}</Td>
                  <Td
                    onClick={() => {
                      navigate(`/jobs/${item.jobsId}`);
                    }}
                  >
                    {item.jobsTitle}
                  </Td>
                  <Button
                    colorScheme={"red"}
                    onClick={() => handleDelete(item.id)}
                  >
                    삭제
                  </Button>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
}

export default ScrapHistory;

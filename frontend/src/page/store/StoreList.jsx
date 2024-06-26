import {
  Box,
  Button,
  Divider,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";

export function StoreList() {
  const [storeList, setStoreList] = useState([]);
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get("/api/only-boss")
      .then(() => {
        axios.get("/api/store/list").then((res) => setStoreList(res.data));
      })
      .catch((err) => {
        if (err.response.status === 403) {
          navigate("/");
        }
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [account.id]);

  if (account.id === "") {
    return <Spinner />;
  }

  return (
    <>
      {account.isBoss() && (
        <Box w={"100%"} minHeight={"500px"}>
          <Box>
            <Box>
              <Heading mb={"10px"} p={1}>
                사업장 목록
              </Heading>
              <Divider mb={"20px"} borderWidth={"2px"} />
            </Box>
            <Box mb={"20px"}>
              <Button
                colorScheme="orange"
                variant={"outline"}
                onClick={() => navigate("/store/register")}
              >
                가게 등록
              </Button>
            </Box>
            <Table>
              <Thead borderY={"2px solid #CCD4E0"}>
                <Tr h={"30px"}>
                  <Th fontSize={"medium"}>#</Th>
                  <Th fontSize={"medium"}>사업장명</Th>
                  <Th fontSize={"medium"}>주소</Th>
                  <Th fontSize={"medium"}>사업장 등록일</Th>
                </Tr>
              </Thead>
              <Tbody>
                {storeList.map((store) => (
                  <Tr
                    key={store.id}
                    _hover={{
                      bgColor: "gray.200",
                    }}
                    cursor={"pointer"}
                    onClick={() => navigate(`/store/${store.id}`)}
                    overflow="hidden"
                    borderBottom={"2px solid #E9E9E9"}
                  >
                    {/* 각 테이블 행의 높이 결정 h={"50"} 이상만 가능한 듯. */}
                    <Td w={"50px"} h={"50px"}>
                      {store.id}
                    </Td>{" "}
                    <Td>{store.name}</Td> <Td>{store.address}</Td>{" "}
                    <Td w={"150px"}>{store.inserted}</Td>{" "}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      )}
    </>
  );
}

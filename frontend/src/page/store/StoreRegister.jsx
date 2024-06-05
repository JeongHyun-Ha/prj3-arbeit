import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function StoreRegister() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("all");
  const [files, setFiles] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  function handleSaveClick() {
    axios
      .postForm("/api/store/add", {
        name: name,
        content: content,
        address: address,
        category: category,
        files: files,
      })
      .then((response) => {
        toast({
          title: "가게 등록 성공",
          description: "새 가게가 등록되었습니다.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/store/list");
      })
      .catch((error) => {
        console.error(
          "There was an error!",
          error.response ? error.response.data : error.message,
        );
        toast({
          title: "가게 등록 실패",
          description: error.response
            ? error.response.data
            : "등록 중 오류가 발생했습니다.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }

  let disableSaveButton = false;
  if (
    name.trim().length === 0 ||
    content.trim().length === 0 ||
    address.trim().length === 0
  ) {
    disableSaveButton = true;
  }

  const fileNameList = [];
  for (let i = 0; i < files.length; i++) {
    fileNameList.push(<li>{files[i].name}</li>);
  }

  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <Box mb={4}>
        <FormControl>
          <FormLabel>가게 이름</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="가게 이름을 입력하세요."
          />
        </FormControl>
      </Box>
      <Box mb={4}>
        <FormControl>
          <FormLabel>가게 내용</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="가게 내용을 입력하세요."
          />
        </FormControl>
      </Box>
      <Box mb={4}>
        <FormControl>
          <FormLabel>가게 주소</FormLabel>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="가게 주소를 입력하세요."
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>사진</FormLabel>
          <Input
            multiple
            type="file"
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
          />
        </FormControl>
      </Box>
      <Box>
        <ul>{fileNameList}</ul>
      </Box>
      <Box mb={4}>
        <FormControl>
          <FormLabel>가게 카테고리</FormLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="카테고리 선택"
          >
            <option value="요식업">요식업</option>
            <option value="미용">미용</option>
            <option value="유통">유통</option>
            <option value="사무직">사무업무</option>
            <option value="생산">생산</option>
            <option value="기타">기타</option>
          </Select>
        </FormControl>
      </Box>

      <Button
        isDisabled={disableSaveButton}
        colorScheme="blue"
        onClick={handleSaveClick}
      >
        저장
      </Button>
    </Box>
  );
}

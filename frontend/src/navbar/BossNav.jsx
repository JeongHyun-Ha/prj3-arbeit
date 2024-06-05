import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function BossNav() {
  const navigate = useNavigate();

  return (
    <>
      <Box onClick={() => navigate("/boss/Signup")}>/bossSignup</Box>
      <Box onClick={() => navigate("/boss/Login")}>/bossLogin</Box>
      <Box onClick={() => navigate("/boss/Edit")}>/bossEdit</Box>
      <Box onClick={() => navigate(`/boss/jobs`)}>/bossAlbaPost</Box>
      <Box onClick={() => navigate(`/boss/jobs/create`)}>
        /bossAlbaPostCreate
      </Box>
      <Box onClick={() => navigate(`/boss/jobs/list`)}>/bossAlbaPostManage</Box>
    </>
  );
}

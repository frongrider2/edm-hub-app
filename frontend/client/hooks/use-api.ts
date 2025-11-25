import { IapiAuth } from "@/apis/index";

const usePublicApi = () => {
  // const token = useToken();
  // return apiServer(token);

  return IapiAuth(false);
};

const useAuthApi = () => {
  return IapiAuth(true);
};

export { usePublicApi, useAuthApi };

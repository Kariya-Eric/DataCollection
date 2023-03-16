import { postAction } from '@/api/common';

const login = (params) => postAction('/uc/login', params);

export { login };

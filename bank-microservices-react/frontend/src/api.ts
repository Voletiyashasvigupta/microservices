import axios from "axios";
export const authUrl=import.meta.env.VITE_AUTH_BASE_URL||"http://localhost:9898";
export const api=axios.create({baseURL:import.meta.env.VITE_GATEWAY_BASE_URL||"http://localhost:8765",timeout:15000,headers:{"Content-Type":"application/json"}});
let token:string|null=null;
export function setToken(v:string|null){token=v;}
api.interceptors.request.use(c=>{if(token)c.headers.set("Authorization",`Bearer ${token}`);else c.headers.delete("Authorization");return c;});
api.interceptors.response.use(r=>r,e=>{console.error("API error",e.response?.status,e.response?.data,e.message);if(e.response?.status===401)window.dispatchEvent(new Event("auth-expired"));return Promise.reject(e);});
export function err(e:unknown){if(axios.isAxiosError(e)){if(e.response?.status===401)return"Session expired or invalid. Please sign in again.";if(e.response?.status===404)return"API route not found.";if(!e.response)return"Network error. Verify services and Gateway CORS configuration.";return typeof e.response.data==="string"?e.response.data:`Request failed (${e.response.status}).`;}return e instanceof Error?e.message:"Unexpected error";}

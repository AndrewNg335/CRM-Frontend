
import { DataProvider } from "@refinedev/core";
import axios from "axios";

const API_URL = "http://localhost:3000"; 

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const { current = 1, pageSize = 12 } = pagination ?? {};
    const query = new URLSearchParams();
    query.set("page", String(current));
    query.set("pageSize", String(pageSize));

    const appendParam = (key: string, value: unknown) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v !== undefined && v !== null && v !== "") {
            query.append(key, String(v));
          }
        });
      } else if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    };

    filters?.forEach((f: any) => {
      if (!f || typeof f.field !== "string") return;
      const field = f.field as string;
      const operator = f.operator as string | undefined;
      const value = f.value;

      if (field === "search") {
        appendParam("search", value);
        return;
      }

      switch (operator) {
        case "contains":
          appendParam(`${field}_like`, value);
          break;
        case "gte":
        case "gt":
          appendParam(`${field}From`, value);
          break;
        case "lte":
        case "lt":
          appendParam(`${field}To`, value);
          break;
        case "in":
          appendParam(field, Array.isArray(value) ? value : String(value ?? "").split(","));
          break;
        case "eq":
        default:
          appendParam(field, value);
          break;
      }
    });

    if (sorters && sorters.length > 0) {
      const last = sorters[sorters.length - 1] as any;
      if (last?.field) query.set("sortField", String(last.field));
      if (last?.order) query.set("sortOrder", String(last.order));
    }

    const url = `${API_URL}/${resource}?${query.toString()}`;
    const response = await axios.get(url, {
      headers: getAuthHeaders(),
    });

    return {
      data: response.data.data,
      total: response.data.total,
    };
  },

  getOne: async ({ resource, id }) => {
    const res = await axios.get(`${API_URL}/${resource}/${id}`, {
      headers: getAuthHeaders(),
    });
    const data = res.data.data;
  
    if (resource === "tasks") {
      return { data: { ...data, id: data._id } };
    }
    return { data: res.data };
  },
  create: async ({ resource, variables }) => {
    const response = await axios.post(`${API_URL}/${resource}`, variables, {
      headers: getAuthHeaders(),
    });
    return {
      data: response.data,
    };
  },

  update: async ({ resource, id, variables }) => {
    let url = `${API_URL}/${resource}/${id}`;
    
    if (resource === "auth") {
      url = `${API_URL}/auth/adminUpdate/${id}`;
    }
    
    const response = await axios.put(url, variables, {
      headers: getAuthHeaders(),
    });
    return {
      data: response.data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const response = await axios.delete(`${API_URL}/${resource}/${id}`, {
      headers: getAuthHeaders(),
    });
    return {
      data: response.data,
    };
  },

  deleteMany: async ({ resource, ids }) => {
    const response = await axios.delete(`${API_URL}/${resource}/bulk`, {
      headers: getAuthHeaders(),
      data: { ids },
    });
    return {
      data: response.data,
    };
  },

  getApiUrl: () => API_URL,
};



import { supabase } from './supabase';

const GRAPHQL_ENDPOINT = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/graphql`;

export interface Employee {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
  position: string;
  salary: number;
  phone?: string;
  address?: string;
  hire_date: string;
  is_active: boolean;
  flagged: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function graphqlRequest(query: string, variables?: any) {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}

export const QUERIES = {
  GET_EMPLOYEES: `
    query GetEmployees($class: String, $isActive: Boolean, $flagged: Boolean, $sortBy: String, $ascending: Boolean) {
      employees
    }
  `,
  GET_EMPLOYEE: `
    query GetEmployee($id: String!) {
      employee
    }
  `,
  GET_EMPLOYEES_PAGINATED: `
    query GetEmployeesPaginated($page: Int, $limit: Int, $class: String, $search: String, $sortBy: String, $ascending: Boolean) {
      employees
      pagination
    }
  `,
};

export const MUTATIONS = {
  CREATE_EMPLOYEE: `
    mutation CreateEmployee($input: EmployeeInput!) {
      employee
    }
  `,
  UPDATE_EMPLOYEE: `
    mutation UpdateEmployee($id: String!, $input: EmployeeInput!) {
      employee
    }
  `,
  DELETE_EMPLOYEE: `
    mutation DeleteEmployee($id: String!) {
      success
    }
  `,
  TOGGLE_FLAG: `
    mutation ToggleFlagEmployee($id: String!) {
      employee
    }
  `,
};

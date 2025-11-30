import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface Employee {
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

interface UserRole {
  role: string;
}

interface GraphQLQuery {
  query: string;
  variables?: any;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ errors: [{ message: 'Authorization header required' }] }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ errors: [{ message: 'Unauthorized' }] }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    const userRole = roleData?.role || 'employee';

    const body: GraphQLQuery = await req.json();
    const { query, variables = {} } = body;

    const result = await resolveGraphQL(query, variables, supabase, user.id, userRole);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ errors: [{ message: error.message }] }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function resolveGraphQL(
  query: string,
  variables: any,
  supabase: any,
  userId: string,
  userRole: string
) {
  const queryMatch = query.match(/query\s+(\w+)/);
  const mutationMatch = query.match(/mutation\s+(\w+)/);

  if (queryMatch) {
    const operationName = queryMatch[1];
    return await resolveQuery(operationName, variables, supabase, userId, userRole);
  } else if (mutationMatch) {
    const operationName = mutationMatch[1];
    return await resolveMutation(operationName, variables, supabase, userId, userRole);
  }

  return { errors: [{ message: 'Invalid GraphQL query' }] };
}

async function resolveQuery(
  operationName: string,
  variables: any,
  supabase: any,
  userId: string,
  userRole: string
) {
  switch (operationName) {
    case 'GetEmployees':
      return await getEmployees(variables, supabase, userRole);
    case 'GetEmployee':
      return await getEmployee(variables, supabase, userId, userRole);
    case 'GetEmployeesPaginated':
      return await getEmployeesPaginated(variables, supabase, userRole);
    default:
      return { errors: [{ message: `Unknown query: ${operationName}` }] };
  }
}

async function resolveMutation(
  operationName: string,
  variables: any,
  supabase: any,
  userId: string,
  userRole: string
) {
  if (userRole !== 'admin') {
    return { errors: [{ message: 'Unauthorized: Admin access required' }] };
  }

  switch (operationName) {
    case 'CreateEmployee':
      return await createEmployee(variables, supabase);
    case 'UpdateEmployee':
      return await updateEmployee(variables, supabase);
    case 'DeleteEmployee':
      return await deleteEmployee(variables, supabase);
    case 'ToggleFlagEmployee':
      return await toggleFlagEmployee(variables, supabase);
    default:
      return { errors: [{ message: `Unknown mutation: ${operationName}` }] };
  }
}

async function getEmployees(variables: any, supabase: any, userRole: string) {
  let query = supabase.from('employees').select('*');

  if (variables.class) {
    query = query.eq('class', variables.class);
  }
  if (variables.isActive !== undefined) {
    query = query.eq('is_active', variables.isActive);
  }
  if (variables.flagged !== undefined) {
    query = query.eq('flagged', variables.flagged);
  }

  if (variables.sortBy) {
    query = query.order(variables.sortBy, { ascending: variables.ascending !== false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    return { errors: [{ message: error.message }] };
  }

  return { data: { employees: data } };
}

async function getEmployee(variables: any, supabase: any, userId: string, userRole: string) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', variables.id)
    .maybeSingle();

  if (error) {
    return { errors: [{ message: error.message }] };
  }

  if (!data) {
    return { errors: [{ message: 'Employee not found' }] };
  }

  return { data: { employee: data } };
}

async function getEmployeesPaginated(variables: any, supabase: any, userRole: string) {
  const page = variables.page || 1;
  const limit = variables.limit || 10;
  const offset = (page - 1) * limit;

  let query = supabase.from('employees').select('*', { count: 'exact' });

  if (variables.class) {
    query = query.eq('class', variables.class);
  }
  if (variables.search) {
    query = query.or(`name.ilike.%${variables.search}%,email.ilike.%${variables.search}%`);
  }

  if (variables.sortBy) {
    query = query.order(variables.sortBy, { ascending: variables.ascending !== false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return { errors: [{ message: error.message }] };
  }

  return {
    data: {
      employees: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    },
  };
}

async function createEmployee(variables: any, supabase: any) {
  const { input } = variables;
  const { data, error } = await supabase
    .from('employees')
    .insert([input])
    .select()
    .single();

  if (error) {
    return { errors: [{ message: error.message }] };
  }

  return { data: { employee: data } };
}

async function updateEmployee(variables: any, supabase: any) {
  const { id, input } = variables;
  const { data, error } = await supabase
    .from('employees')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { errors: [{ message: error.message }] };
  }

  return { data: { employee: data } };
}

async function deleteEmployee(variables: any, supabase: any) {
  const { id } = variables;
  const { error } = await supabase.from('employees').delete().eq('id', id);

  if (error) {
    return { errors: [{ message: error.message }] };
  }

  return { data: { success: true } };
}

async function toggleFlagEmployee(variables: any, supabase: any) {
  const { id } = variables;
  
  const { data: employee, error: fetchError } = await supabase
    .from('employees')
    .select('flagged')
    .eq('id', id)
    .single();

  if (fetchError) {
    return { errors: [{ message: fetchError.message }] };
  }

  const { data, error } = await supabase
    .from('employees')
    .update({ flagged: !employee.flagged })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { errors: [{ message: error.message }] };
  }

  return { data: { employee: data } };
}
const BASE_URL = 'http://localhost:8080/api'

async function get(endpoint: string, params?: Record<string, any>) {
  const query = params
    ? '?' + new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : ''

  const response = await fetch(`${BASE_URL}/${endpoint}${query}`)
  if (!response.ok) throw new Error(`Erro na requisição: ${endpoint}: ${response.statusText}`)
  return response.json()
}

async function post(endpoint: string, body: any) {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Erro na requisição: ${endpoint}: ${response.statusText}`);
    return response.json();
}

async function put(endpoint: string, body: any) {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Erro na requisição: ${endpoint}: ${response.statusText}`);
    return response.json();
}

async function del(endpoint: string) {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Erro na requisição: ${endpoint}: ${response.statusText}`);
    return response.json();
}

export const api = {
    get,
    post,
    put,
    del
};
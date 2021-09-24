const routeSchedule = '/schedule';

const reqObject = (data) => ({
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
    charset: 'UTF-8',
  },
});

const postRequest = (route) => async (data) => {
  try {
    const response = await fetch(route, reqObject(data));

    if (response.ok) {
      const result = response.json();
      return result;
    }
  } catch (e) {
    console.error(e);
  }
};

const getTableContent = postRequest(routeSchedule);

export default getTableContent;

import api from "@/utils/api";

interface CreateShiftTimeData {
  startTime: string; // örn: "09:00"
  endTime: string; // örn: "18:00"
}

interface CreateShiftTimeResponse {
  id: string;
  startTime: string;
  endTime: string;
}

export async function createShiftTime(
  data: CreateShiftTimeData
): Promise<CreateShiftTimeResponse> {
  const today = new Date();
  const [startHour, startMinute] = data.startTime.split(":").map(Number);
  const [endHour, endMinute] = data.endTime.split(":").map(Number);

  const startDateTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    startHour,
    startMinute
  );
  const endDateTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    endHour,
    endMinute
  );

  const response = await api.post<CreateShiftTimeResponse>("v1/shift-times", {
    startTime: startDateTime.toISOString(),
    endTime: endDateTime.toISOString(),
  });

  return response.data;
}

export const getShiftTimes = async () => {
  const response = await api.get("v1/shift-times");
  return response.data;
};

export const updateShiftTime = async (
  id: string,
  data: { startTime: string; endTime: string }
) => {
  const response = await api.put(`v1/shift-times/${id}`, data);
  return response.data;
};

export const deleteShiftTime = async (id: string) => {
  const response = await api.delete(`v1/shift-times/${id}`);
  return response.data;
};

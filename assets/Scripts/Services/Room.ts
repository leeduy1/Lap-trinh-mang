import { IJoinRoom, IJoinRoomResponse } from "../Interfaces/JoinRoom";
import { Participant } from "../Models/Participant";
import http from "../Utils/Http";

export const getParticipantInRoom = async (roomId: string) => {
  try {
    const response = await http.get<Participant[]>(
      `/rooms/${roomId}/participants`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const joinRoom = async (joinRoomData: IJoinRoom) => {
  try {
    const response = await http.post<IJoinRoomResponse>(
      "/rooms/join",
      joinRoomData
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const leaveRoom = async (roomId: string) => {
  const response = await http.post<Participant>(`/rooms/${roomId}/leave`);
  return response;
};

export const checkLatestMatchFinished = async (roomId: string) => {
  try {
    const response = await http.get<boolean>(
      `/rooms/${roomId}/latest-match-finished`
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

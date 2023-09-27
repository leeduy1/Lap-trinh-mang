import { Lobby } from "../Models/Lobby";
import { Room } from "../Models/Room";
import http from "../Utils/Http";

export const getLobby = async () => {
  try {
    const response = await http.get<Lobby>("/lobby");
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const getRoomsInLobby = async (lobbyId: string) => {
  try {    
    const response = await http.get<Lobby>('/rooms', {
      params: {
        lobbyId
      } 
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

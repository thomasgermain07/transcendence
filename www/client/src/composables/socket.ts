import { Manager, Socket } from "socket.io-client";
import Cookies             from "js-cookie";

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------
const sockets: { [name: string]: Socket } = {};

// -----------------------------------------------------------------------------
// Composable
// -----------------------------------------------------------------------------
export function useSocket(nsp: string)
{
	const manager = new Manager("ws://localhost:8080", {
		extraHeaders: {
			'authorization': Cookies.get('Authentication'),
		},
	});

	// -------------------------------------------------------------------------
	// Datas
	// -------------------------------------------------------------------------
	sockets[nsp] ||= manager.socket(`/${nsp}`);

	// -------------------------------------------------------------------------
	// Functions
	// -------------------------------------------------------------------------
	function close()
	{
		sockets[nsp]?.close();
		delete sockets[nsp];
	}

	return {
		// Datas
		socket: sockets[nsp],

		// Functions
		close,
	};
};

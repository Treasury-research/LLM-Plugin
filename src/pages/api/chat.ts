import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== "GET") {
		res
			.status(405)
			.send({ code: -1, message: "Only GET requests allowed" } as any);
		return;
	}
	try {
		const result = await axios.get(
			"https://knn3-gateway.knn3.xyz/nl/api/chat",
			{
				params: {
					chat_id: req.query.chat_id,
					nl_input: req.query.nl_input,
				},
				headers: {
					"auth-key": "44a6a613-4e21-478b-a909-ab653c9d39df",
				},
			}
		);

		// console.log("==========result", result);
		if (result.status === 200) {
			res.status(200).json(result.data);
		} else {
			res.status(500).json({
				code: -1,
				data: "handle error!",
			});
		}
	} catch (error:any) {
		// console.log(error);
		res.status(500).json({
			code: -1,
			data: error.message,
		});
	}
};

export default handler;

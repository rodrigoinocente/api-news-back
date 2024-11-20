import { Request, Response } from "express";
import journalistService from "../services/journalist.service";
import { IJournalist } from "../../custom";

const creatJournalist = async (req: Request, res: Response): Promise<Response | void> => {
    const body = req.body;

    try {
        await journalistService.createJournalistService(body);

        return res.status(201).send({ message: "Journalist created successfully", });
    } catch (err: any) {
        if (err.message === "Submit all fields for registration")
            return res.status(400).send({ message: err.message });

        if (err.message === "The provided email is already in use")
            return res.status(400).send({ message: err.message });

        if (err.message === "Error creating Journalist")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const findAllJournalist = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const journalists: IJournalist[] = await journalistService.findAllJournalistService();
        res.status(200).send(journalists);
    } catch (err: any) {
        if (err.message === "There are no registered journalist")
            return res.status(404).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

// // const findByEmail = async (req: Request, res: Response): Promise<Response | void> => {
// //     const email = req.params.email;

// //     try {
// //         const user: IUser | null = await userService.findByEmailService(email);

// //         res.status(200).send(user);
// //     } catch (err: any) {
// //         if (err.message === "User not found by email")
// //             return res.status(404).send({ message: err.message });

// //         return res.status(500).send({ message: "An unexpected error occurred" });
// //     };
// // };

// const findById = async (req: Request, res: Response): Promise<Response | void> => {
//     const userId = res.locals.userId;

//     try {
//         const user = await userService.findByIdService(userId);

//         return res.status(200).send(user);
//     } catch (err: any) {
//         if (err.message === "User not found by id")
//             return res.status(404).send({ message: err.message });

//         return res.status(500).send({ message: "An unexpected error occurred" });
//     };
// };

// const update = async (req: Request, res: Response): Promise<Response | void> => {   
//     const userToFoundId = res.locals.userId;
//     const userLoggedId = res.locals.userLoggedId;
//     const body = req.body;

//     try {
//         const user = await userService.updateService(userToFoundId, userLoggedId, body);

//         return res.status(200).send({ message: "User successfully updated", user });

//     } catch (err: any) {
//         if (err.message === "Submit at least one fields for update")
//             return res.status(400).send({ message: err.message });

//         if (err.message === "You didn't update this user")
//             return res.status(403).send({ message: err.message });

//         if (err.message === "The provided email is already in use")
//             return res.status(400).send({ message: err.message });

//         if (err.message === "User not found by ID")
//             return res.status(404).send({ message: err.message });

//         return res.status(500).send({ message: "An unexpected error occurred" });
//     };
// };

// const getLoggedInUser = async (req: Request, res: Response): Promise<Response | void> => {
//     const userLoggedId = res.locals.userLoggedId;

//     try {
//         const user = await userService.findByIdService(userLoggedId);

//         return res.status(200).send(user);
//     } catch (err: any) {
//         if (err.message === "User not found by id")
//             return res.status(404).send({ message: err.message });

//         return res.status(500).send({ message: "An unexpected error occurred" });
//     };
// };
// 
export default {
    creatJournalist,
    findAllJournalist,
    //     findByEmail,
    //     findById,
    //     update,
    //     getLoggedInUser
};
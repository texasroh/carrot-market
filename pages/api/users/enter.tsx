import twilio from "twilio";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { mainModule } from "process";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { phone, email } = req.body;
    /*
  let user;
  if (email) {
    user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      console.log("couldn't find one!");
      user = await client.user.create({
        data: {
          name: "Anonymous",
          email,
        },
      });
    }
    console.log(user);
  } else if (phone) {
    user = await client.user.findUnique({
      where: {
        phone: +phone,
      },
    });
    if (!user) {
      console.log("couldn't find one!");
      user = await client.user.create({
        data: {
          name: "Anonymous",
          phone: +phone,
        },
      });
    }
  }
  */
    const user = phone ? { phone } : email ? { email } : null;
    if (!user) return res.status(400).json({ ok: false });
    const payload = Math.floor(100000 + Math.random() * 900000) + "";
    // const user = await client.user.upsert({
    //   where: {
    //     ...payload,
    //   },
    //   create: {
    //     ...payload,
    //     name: "Anonymous",
    //   },
    //   update: {},
    // });
    const token = await client.token.create({
        data: {
            payload,
            user: {
                // connect: {
                //   id: user.id,
                // },
                connectOrCreate: {
                    where: {
                        ...user,
                    },
                    create: {
                        ...user,
                        name: "Anonymous",
                    },
                },
            },
        },
    });
    if (phone) {
        console.log("sms sent");
        // const message = await twilioClient.messages.create({
        //     messagingServiceSid: process.env.TWILIO_MSG_SID,
        //     to: process.env.TWILIO_VERIFIED_PHONE_NUMBER!, //phone
        //     body: `Your login token is ${payload}.`,
        // });
        // console.log(message);
    } else if (email) {
        console.log("email sent");
        //이메일 보내는 로직.
        //sendgrid를 이용해도 되고
        //mailgun을 써도 되고,
        //nodemailer를 쓰면 smtp를 직접 해야함.
    }
    console.log("token", payload);
    return res.json({ ok: true });
}

export default withHandler("POST", handler);

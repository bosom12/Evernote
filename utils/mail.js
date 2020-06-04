import nodemailer from 'nodemailer';
import ses from 'nodemailer-ses-transport'


const {region, ACCESS_KEY_ID, SECRET_ACCESS_KEY } = process.env;

const transport = nodemailer.createTransport(
  ses({
    region,
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  })
)

export const send = async (options) => {
 const mailOption = {
   from: 'Evernote <sales@oct.ng>',
   to: options.email,
   subject: options.subject,
   html: options.html,
   text: options.text
 }

 return transport.sendMail(mailOption)
}

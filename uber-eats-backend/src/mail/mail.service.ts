import got from 'got';
import * as FormData from 'form-data';
import { Injectable, Inject } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
	constructor(@Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions) {}

	private async sendEmail(subject: string, template: string, emailVars: EmailVar[]) {
		const form = new FormData();
		form.append('from', `Bekzod from Uber Eats <mailgun@${this.options.domain}>`);
		form.append('to', `bektuxtasinov@gmail.com`);
		form.append('subject', subject);
		form.append('template', template);
		emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));

		try {
			await got.post(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
				headers: {
					Authorization: `Basic ${Buffer.from(`api:${this.options.apiKey}`).toString(
						'base64'
					)}`,
				},
				body: form,
			});
		} catch (error) {
			console.log(error);
		}
	}

	sendVerificationEmail(email: string, code: string) {
		this.sendEmail('Verify Your Email', 'uber', [
			{ key: 'code', value: code },
			{ key: 'username', value: email },
		]);
	}
}

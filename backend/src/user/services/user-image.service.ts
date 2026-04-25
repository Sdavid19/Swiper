import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { ImageService } from '../../shared/image/image.service';
import { UserImageDto } from '../dto';

@Injectable()
export class UserImageService {
    constructor(
        private readonly userService: UserService,
        private readonly imageService: ImageService,
    ) { }

    async updateBankImage(id: number, filename: string,): Promise<UserImageDto> {
        const user = await this.userService.findUserById(id);

        const newFilename = await this.imageService.optimizeImage(filename);

        await this.imageService.deleteIfExists(user.imageUrl);

        return this.userService.updateImage(id, newFilename);
    }
}

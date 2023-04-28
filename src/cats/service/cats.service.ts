import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CatRequestDto } from '../dto/cats.request.dto';
import { CatsRepository } from '../cats.repository';
import { Cat } from '../cats.schema';

@Injectable()
export class CatsService {
  // constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}, 직접 연결해서 사용방법

  constructor(private readonly catsRepository: CatsRepository) {} //* Repository 인젝션 받기

  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;

    const isCatExist = await this.catsRepository.existsByEmail(email); //* Repository 패턴사용해서 연결 방법
    // const isCatExist = await this.catModel.exists({ email }); // 직접 연결해서 찾는 방법

    if (isCatExist) {
      throw new UnauthorizedException('해당하는 고양이는 이미 존재합니다.'); //* 403 코드 익셉션 [=UnauthorizedException]
      // throw new HttpException('해당하는 고양이는 이미 존재합니다.',403)
    }

    const hashedPassword = await bcrypt.hash(password, 10); //* 암호화

    //* 직접 정보 생성
    const cat = await this.catsRepository.create({
      email,
      name,
      password: hashedPassword,
    });
    // return cat;
    return cat.readOnlyData; // virtual 기능을 사용한 리턴값
  }

  //* 이미지 업로드
  async uploadImg(cat: Cat, files: Express.Multer.File[]) {
    const fileName = `cats/${files[0].filename}`;

    console.log(fileName);
    const newCat = await this.catsRepository.findByIdAndUpdateImg(
      cat.id,
      fileName,
    );
    console.log(newCat);
    return newCat;
  }

  async getAllCat() {
    const allCat = await this.catsRepository.findAll();
    const readOnlyCats = allCat.map((cat) => cat.readOnlyData);
    return readOnlyCats;
  }
}

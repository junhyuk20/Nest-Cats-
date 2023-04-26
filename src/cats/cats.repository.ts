//* mapper 인터페이스 녀석
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from './cats.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CatRequestDto } from './dto/cats.request.dto';

@Injectable()
export class CatsRepository {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  //* 계정 생성
  async create(cat: CatRequestDto): Promise<Cat> {
    return await this.catModel.create(cat);
  }

  //* 들어온 이메일과 매칭되는 녀석이 있냐 없냐 찾기
  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.catModel.exists({ email }); //* 몽구스 exists( ) 함수의 결괏값으로는 id :any 이 반환되고 값이 없으면 null을 반환
    if (result) return true;
    else return false;
  }

  //* 들어온 파라메터 email 이 db에 있나 확인후 그결괏 값을 리턴 (있으면 Cat 이되는거고, 없으면 없으니 당연 null 이겠지)
  async findCatByEmail(email: string): Promise<Cat | null> {
    const cat = await this.catModel.findOne({ email });
    return cat;
  }

  //* 인증
  async findCatByIdWithoutPassword(catId: string): Promise<Cat | null> {
    const cat = this.catModel.findById(catId).select('-password'); //* 여기서 select 함수는 원하는 필드만을 가져올떄 사용되며, '-'을 사용후 필드명을 붙이게 되면 해당 필드만 빼고 나머지 가져오겠다 라는 뜻임
    return cat;
  }
}

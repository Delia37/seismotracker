//src/auth/entity/auth.entity.ts
import { ApiProperty } from "@nestjs/swagger";

export class AuthEntity {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  id: number;
}

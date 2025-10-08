import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { City } from './entities/city.entity';
import { State } from './entities/state.entity';
import { Country } from './entities/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, State, Country])
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService]
})
export class LocationsModule {}

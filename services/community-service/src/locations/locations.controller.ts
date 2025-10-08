import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { City } from './entities/city.entity';
import { State } from './entities/state.entity';
import { Country } from './entities/country.entity';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('cities/:id')
  async getCityById(@Param('id', ParseIntPipe) id: number): Promise<City | null> {
    return this.locationsService.findCityById(id);
  }

  @Get('cities/search')
  async searchCities(@Query('q') query: string): Promise<City[]> {
    return this.locationsService.searchCities(query);
  }

  @Get('cities/by-state/:stateCode')
  async getCitiesByState(@Param('stateCode') stateCode: string): Promise<City[]> {
    return this.locationsService.findCitiesByStateCode(stateCode);
  }

  @Get('cities/by-country/:countryCode')
  async getCitiesByCountry(@Param('countryCode') countryCode: string): Promise<City[]> {
    return this.locationsService.findCitiesByCountryCode(countryCode);
  }

  @Get('states/:id')
  async getStateById(@Param('id', ParseIntPipe) id: number): Promise<State | null> {
    return this.locationsService.findStateById(id);
  }

  @Get('states/by-country/:countryCode')
  async getStatesByCountry(@Param('countryCode') countryCode: string): Promise<State[]> {
    return this.locationsService.findStatesByCountryCode(countryCode);
  }


  @Get('countries/:id')
  async getCountryById(@Param('id', ParseIntPipe) id: number): Promise<Country | null> {
    return this.locationsService.findCountryById(id);
  }

  @Get('countries/by-code/:countryCode')
  async getCountryByCode(@Param('countryCode') countryCode: string): Promise<Country | null> {
    return this.locationsService.findCountryByCode(countryCode);
  }
}

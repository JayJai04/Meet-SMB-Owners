import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { State } from './entities/state.entity';
import { Country } from './entities/country.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>,
    @InjectRepository(State)
    private readonly statesRepository: Repository<State>,
    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,
  ) {}

  // City methods
  async findCityById(id: number): Promise<City | null> {
    return this.citiesRepository.findOne({
      where: { id },
      relations: ['state', 'country']
    });
  }

  async findCitiesByName(name: string): Promise<City[]> {
    return this.citiesRepository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.state', 'state')
      .leftJoinAndSelect('city.country', 'country')
      .where('LOWER(city.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .limit(10)
      .getMany();
  }

  async findCitiesByStateCode(stateCode: string): Promise<City[]> {
    return this.citiesRepository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.state', 'state')
      .leftJoinAndSelect('city.country', 'country')
      .where('city.stateCode = :stateCode', { stateCode })
      .getMany();
  }

  async findCitiesByCountryCode(countryCode: string): Promise<City[]> {
    return this.citiesRepository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.state', 'state')
      .leftJoinAndSelect('city.country', 'country')
      .where('city.countryCode = :countryCode', { countryCode })
      .getMany();
  }


  async findStateById(id: number): Promise<State | null> {
    return this.statesRepository.findOne({
      where: { id },
      relations: ['country']
    });
  }

  async findStatesByCountryCode(countryCode: string): Promise<State[]> {
    return this.statesRepository
      .createQueryBuilder('state')
      .leftJoinAndSelect('state.country', 'country')
      .where('state.countryCode = :countryCode', { countryCode })
      .getMany();
  }


  async findCountryById(id: number): Promise<Country | null> {
    return this.countriesRepository.findOne({ where: { id } });
  }

  async findCountryByCode(countryCode: string): Promise<Country | null> {
    return this.countriesRepository.findOne({ 
      where: { iso2: countryCode } 
    });
  }

  // Get all cities (with pagination for performance)
  async getAllCities(limit: number = 100): Promise<City[]> {
    return this.citiesRepository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.state', 'state')
      .leftJoinAndSelect('city.country', 'country')
      .orderBy('city.name', 'ASC')
      .limit(limit)
      .getMany();
  }

  // Search methods for autocomplete
  async searchCities(query: string, limit: number = 10): Promise<City[]> {
    return this.citiesRepository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.state', 'state')
      .leftJoinAndSelect('city.country', 'country')
      .where('LOWER(city.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(state.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(country.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orderBy(
        `CASE 
          WHEN LOWER(city.name) LIKE LOWER(:startsWithQuery) THEN 1
          WHEN LOWER(state.name) LIKE LOWER(:startsWithQuery) THEN 2
          ELSE 3
        END`,
        'ASC'
      )
      .addOrderBy('city.name', 'ASC')
      .setParameter('startsWithQuery', `${query}%`)
      .limit(limit)
      .getMany();
  }
}

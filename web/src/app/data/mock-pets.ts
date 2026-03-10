export interface PetSummary {
  id: string;
  name: string;
  species: string;
  age: string;
  status: string;
  avatar: string;
}

export const MOCK_PETS: PetSummary[] = [
  { id: 'pet-001', name: 'Lucky', species: '柴犬', age: '2 岁 7 个月', status: '疫苗即将到期', avatar: 'L' },
  { id: 'pet-002', name: 'Mimi', species: '布偶猫', age: '1 岁 3 个月', status: '饮食监控中', avatar: 'M' },
  { id: 'pet-003', name: 'Coco', species: '英短', age: '3 岁', status: '术后随访', avatar: 'C' }
];

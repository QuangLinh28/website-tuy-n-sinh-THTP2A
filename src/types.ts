/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ApplicationStatus = 
  | 'Nháp'           // Draft
  | 'Đã nộp'         // Submitted
  | 'Đang duyệt'     // Reviewing
  | 'Cần bổ sung'    // Needs Action / Missing Docs
  | 'Đã duyệt'       // Approved
  | 'Đã nhập học'    // Enrolled
  | 'Từ chối';       // Rejected

export type ProgramPreference = 
  | 'Tích hợp'       // Integrated Cambridge English
  | 'Tăng cường'     // Intensive English
  | 'Đại trà';       // Standard curriculum

export type BoardingOption = 
  | 'Bán trú'        // Boarding / Daycare
  | 'Ngoại trú';      // Non-boarding

export interface Address {
  province: string;
  district: string;
  ward: string;
  street: string;
}

export interface AttachedDocuments {
  birthCertificate: string;   // Mock file name or base64 data
  residenceCert: string;      // CT07 residence confirmation
  kindergartenCert: string;   // Kindergarten graduation
  studentPhoto: string;       // Student 3x4 photo
}

export interface StudentApplication {
  id: string;                 // e.g., TS1-2026-1024
  studentName: string;
  dob: string;                // YYYY-MM-DD
  gender: 'Nam' | 'Nữ';
  ethnic: string;             // Kinh, Hoa, etc.
  pob: string;                // Place of birth
  nationalId: string;         // 12-digit Vietnamese citizen ID / identification code
  permanentAddress: Address;
  currentAddress: Address;
  isSameAddress: boolean;
  
  kindergartenName: string;
  kindergartenDistrict: string;
  
  fatherName: string;
  fatherDob: string;
  fatherPhone: string;
  fatherJob: string;
  fatherEmail: string;
  
  motherName: string;
  motherDob: string;
  motherPhone: string;
  motherJob: string;
  motherEmail: string;
  
  programPreference: ProgramPreference;
  boardingOption: BoardingOption;
  hasBusService: boolean;
  notes: string;
  
  createdAt: string;
  updatedAt: string;
  status: ApplicationStatus;
  adminComment: string;
  documents: AttachedDocuments;
}

export interface SchoolQuota {
  'Tích hợp': number;
  'Tăng cường': number;
  'Đại trà': number;
}

export const ETHNIC_GROUPS = [
  'Kinh', 'Tày', 'Thái', 'Mường', 'Khơ Me', 'H\'Mông', 'Nùng', 'Hoa', 'Dao', 'Gia Rai', 'Ê Đê', 'Ba Na', 'Sán Chay', 'Chăm', 'Khác'
];

export const PROVINCES = [
  'Tỉnh Đồng Tháp',
  'Thành phố Hồ Chí Minh',
  'Hà Nội',
  'Bình Dương',
  'Đồng Nai',
  'Long An'
];

export const HCMC_DISTRICTS = [
  'Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 10', 'Quận 11', 'Quận 12',
  'Quận Bình Tân', 'Quận Bình Thạnh', 'Quận Gò Vấp', 'Quận Phú Nhuận', 'Quận Tân Bình', 'Quận Tân Phú',
  'Thành phố Thủ Đức', 'Huyện Bình Chánh', 'Huyện Cần Giờ', 'Huyện Củ Chi', 'Huyện Hóc Môn', 'Huyện Nhà Bè'
];

export const DONG_THAP_DISTRICTS = [
  'Huyện Hồng Ngự',
  'Thành phố Hồng Ngự',
  'Thành phố Cao Lãnh',
  'Thành phố Sa Đéc',
  'Huyện Cao Lãnh',
  'Huyện Châu Thành',
  'Huyện Lai Vung',
  'Huyện Lấp Vò',
  'Huyện Tam Nông',
  'Huyện Tân Hồng',
  'Huyện Thanh Bình',
  'Huyện Tháp Mười'
];

export const WARDS_QUAN_1 = [
  'Phường Bến Nghé', 'Phường Bến Thành', 'Phường Cầu Kho', 'Phường Cầu Ông Lãnh', 'Phường Cô Giang',
  'Phường Đa Kao', 'Phường Nguyễn Cư Trinh', 'Phường Nguyễn Thái Bình', 'Phường Phạm Ngũ Lão', 'Phường Tân Định'
];

export const WARDS_HONG_NGU = [
  'Xã Thường Phước',
  'Xã Thường Phước 1',
  'Xã Thường Phước 2',
  'Xã Thường Thới Hậu A',
  'Xã Thường Thới Tiền',
  'Xã Phú Thuận A',
  'Xã Phú Thuận B',
  'Xã Long Khánh A',
  'Xã Long Khánh B'
];

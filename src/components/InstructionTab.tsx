/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileText, 
  Clock, 
  Award, 
  HelpCircle, 
  AlertCircle, 
  Calendar, 
  BookOpen, 
  Users, 
  PhoneCall, 
  MapPin, 
  FileCheck
} from 'lucide-react';

interface InstructionTabProps {
  onStartRegistration: () => void;
}

export default function InstructionTab({ onStartRegistration }: InstructionTabProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 md:p-12 shadow-md">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <BookOpen size={400} />
        </div>
        <div className="max-w-3xl relative z-10">
          <span className="bg-amber-500 text-slate-900 font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
            Năm học 2026 - 2027
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4 font-sans leading-tight">
            Cổng Đăng Ký Tuyển Sinh Lớp 1 Trực Tuyến
          </h1>
          <p className="text-blue-100 mt-4 text-base md:text-lg max-w-2xl leading-relaxed">
            Chào mừng Quý phụ huynh đến với Hệ thống Tuyển sinh trực tuyến của Trường Tiểu học Thường Phước 2A, Đồng Tháp. Vui lòng đọc kỹ thông tin hướng dẫn dưới đây trước khi đăng ký hồ sơ cho con em.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button 
              onClick={onStartRegistration}
              id="btn-register-now"
              className="bg-white hover:bg-blue-50 text-blue-900 font-semibold px-6 py-3 rounded-lg shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Đăng ký nhập học ngay
            </button>
            <a 
              href="#timeline"
              id="link-timeline"
              className="bg-blue-800/60 hover:bg-blue-800/80 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 border border-blue-700/50"
            >
              Xem lịch tuyển sinh
            </a>
          </div>
        </div>
      </div>

      {/* Critical Note */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-3">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-semibold text-amber-900 text-sm">Thông tin quan trọng cho độ tuổi nhập học</h4>
          <p className="text-amber-800 text-xs mt-1 leading-relaxed">
            Học sinh đăng ký vào Lớp 1 năm học 2026-2027 phải sinh năm **2020** (từ 01/01/2020 đến 31/12/2020). Hệ thống sẽ tự động đối chiếu số Mã định danh cá nhân của học sinh với Cơ sở dữ liệu dân cư quốc gia để xác nhận độ tuổi và thông tin phân tuyến của Ủy ban Nhân dân tỉnh Đồng Tháp, xã Thường Phước.
          </p>
        </div>
      </div>

      {/* Three Columns Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Programs */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center mb-4">
              <Award size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Mô hình học tập</h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Trường cung cấp 3 chương trình đào tạo chính thức nhằm phát triển toàn diện tư duy, kỹ năng sống và ngoại ngữ:
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span><strong>Tiếng Anh Tích hợp (Cambridge):</strong> Học Toán, Khoa học, Tiếng Anh với GV bản ngữ chất lượng cao.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span><strong>Tăng cường Tiếng Anh:</strong> Tăng giờ thực hành, rèn luyện giao tiếp phản xạ tự nhiên.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span><strong>Chương trình Đại trà:</strong> Chuẩn của Bộ Giáo dục & Đào tạo kết hợp các hoạt động kỹ năng trải nghiệm.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Requirements Documents */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center mb-4">
              <FileText size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Hồ sơ đăng ký trực tuyến</h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Phụ huynh chuẩn bị bản chụp (JPEG/PNG) hoặc tệp PDF của các loại giấy tờ gốc sau để đính kèm vào hồ sơ đăng ký:
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <FileCheck size={14} className="text-teal-600 shrink-0" />
                <span><strong>Giấy khai sinh gốc</strong> (bản chụp rõ nét, không mất góc)</span>
              </li>
              <li className="flex items-center gap-2">
                <FileCheck size={14} className="text-teal-600 shrink-0" />
                <span><strong>Giấy xác nhận thông tin cư trú (CT07)</strong> hoặc tài khoản VNeID cấp độ 2</span>
              </li>
              <li className="flex items-center gap-2">
                <FileCheck size={14} className="text-teal-600 shrink-0" />
                <span><strong>Giấy chứng nhận hoàn thành mầm non 5 tuổi</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <FileCheck size={14} className="text-teal-600 shrink-0" />
                <span><strong>1 ảnh chân dung 3x4</strong> của trẻ (phông nền trắng)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Admission Board Contact */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Ban Tuyển Sinh Trường TH Thường Phước 2A</h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Mọi thắc mắc về điều kiện tuyển sinh, cách thức nộp hồ sơ, hoặc khó khăn kỹ thuật xin vui lòng liên hệ:
            </p>
            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <PhoneCall size={14} className="text-amber-600 shrink-0" />
                <span>Hotline: <strong>0328232804</strong> (8h00 - 17h00)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <span>Địa chỉ: <strong>Ấp Mương Kinh, xã Thường Phước, tỉnh Đồng Tháp</strong></span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2 text-slate-500">
                Lưu ý: Nhà trường hỗ trợ đăng ký trực tiếp tại phòng máy trường học đối với Phụ huynh không có thiết bị hoặc gặp lỗi kết nối internet.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div id="timeline" className="bg-white p-6 md:p-8 rounded-xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-6">
          <Calendar size={20} className="text-blue-900" />
          <h3 className="font-bold text-slate-900 text-lg">Kế hoạch & Thời gian tuyển sinh Lớp 1</h3>
        </div>
        
        <div className="relative border-l-2 border-blue-100 ml-3 md:ml-6 space-y-8">
          {/* Step 1 */}
          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-900 border-2 border-white ring-4 ring-blue-100" />
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
              <h4 className="font-semibold text-slate-950 text-sm">Giai đoạn 1: Khai báo & Đăng ký trực tuyến</h4>
              <span className="text-xs bg-blue-50 text-blue-800 font-medium px-2.5 py-0.5 rounded-full">15/06 - 25/07/2026</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Phụ huynh truy cập cổng tuyển sinh điện tử này, nhập Mã định danh của học sinh, điền đầy đủ các thông tin và đính kèm hồ sơ trực tuyến theo yêu cầu. Nhấp kiểm tra định dạng và ký xác nhận.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-900 border-2 border-white ring-4 ring-blue-100" />
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
              <h4 className="font-semibold text-slate-950 text-sm">Giai đoạn 2: Xét duyệt & Đối chiếu thông tin</h4>
              <span className="text-xs bg-amber-50 text-amber-800 font-medium px-2.5 py-0.5 rounded-full">26/06 - 25/07/2026</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Ban tuyển sinh nhà trường tiến hành duyệt hồ sơ, đối chiếu dữ liệu hộ khẩu cư trú thực tế tại xã Thường Phước, tỉnh Đồng Tháp. Trường hợp thiếu giấy tờ hoặc mờ ảnh chụp, trường sẽ cập nhật trạng thái "Cần bổ sung" và thông báo tới phụ huynh qua SMS/Zalo.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-teal-600 border-2 border-white ring-4 ring-teal-100" />
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
              <h4 className="font-semibold text-slate-950 text-sm">Giai đoạn 3: Công bố danh sách trúng tuyển chính thức</h4>
              <span className="text-xs bg-teal-50 text-teal-800 font-medium px-2.5 py-0.5 rounded-full">Bắt đầu từ 30/07/2026</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Công bố kết quả học sinh trúng tuyển lớp Tích hợp, Tăng cường và Đại trà. Phụ huynh tra cứu kết quả bằng số định danh cá nhân trực tiếp trên cổng này.
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative pl-6 md:pl-8">
            <div className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white ring-4 ring-indigo-100" />
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
              <h4 className="font-semibold text-slate-950 text-sm">Giai đoạn 4: Hoàn thành nộp hồ sơ giấy & Nhận lớp</h4>
              <span className="text-xs bg-indigo-50 text-indigo-800 font-medium px-2.5 py-0.5 rounded-full">11/07 - 20/07/2026</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Phụ huynh học sinh trúng tuyển đem theo bản gốc Giấy khai sinh, CT07 để Ban giám hiệu nhà trường đối chiếu, xác nhận hồ sơ vật lý, nhận bàn giao đồng phục và phân lớp học sinh.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-6">
          <HelpCircle size={20} className="text-blue-900" />
          <h3 className="font-bold text-slate-900 text-lg">Câu hỏi thường gặp (FAQs)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 text-sm">Tôi có thể đăng ký đồng thời cả 3 nguyện vọng không?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Khi đăng ký, phụ huynh được quyền lựa chọn chương trình học ưu tiên cao nhất (ví dụ: Tiếng Anh Tích hợp). Nếu sĩ số học sinh tích hợp vượt quá chỉ tiêu, Ban tuyển sinh sẽ tự động xét duyệt chuyển học sinh sang diện Tăng cường Tiếng Anh hoặc Đại trà nếu gia đình đồng ý.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 text-sm">Mã định danh cá nhân lấy ở đâu?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mã định danh của trẻ là dãy số gồm 12 số được ghi trực tiếp trên **Giấy khai sinh mẫu mới (bản từ năm 2016 trở đi)** hoặc trên Giấy xác nhận thông tin cư trú CT07 cấp bởi Công an xã/phường nơi đăng ký thường trú.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 text-sm">Học sinh trái tuyến có được xét tuyển không?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nhà trường ưu tiên tuyệt đối cho học sinh thuộc diện đúng tuyến theo phân bổ chỉ tiêu của UBND xã Thường Phước, huyện Hồng Ngự, tỉnh Đồng Tháp. Đối với học sinh trái tuyến ngoài xã, nhà trường chỉ xét tuyển nếu chỉ tiêu còn dư sau khi tiếp nhận hết học sinh đúng tuyến và được phê duyệt của Phòng Giáo dục & Đào tạo.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 text-sm">Làm thế nào để biết hồ sơ có sai sót cần chỉnh sửa?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Quý phụ huynh hãy thường xuyên truy cập vào thẻ **"Tra cứu hồ sơ"** trên thanh công cụ này, nhập số định danh cá nhân của bé. Nếu hồ sơ cần chỉnh sửa, Ban tuyển sinh sẽ nêu rõ lý do và cho phép cập nhật, bổ sung trực tuyến tức thì.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

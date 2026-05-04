import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Users, Leaf, Trophy, Play, Home, TreePine } from 'lucide-react';

type Answer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type QuestionDef = {
  id: string;
  tier: 1 | 2 | 3;
  text: string;
  answers: Answer[];
  expertAdvice: string;
};

type Question = QuestionDef & {
  points: number;
};

const POINTS = [200, 400, 600, 1000, 2000, 3000, 6000, 10000, 14000, 22000, 30000, 40000, 60000, 85000, 150000];

const QUESTION_BANK: QuestionDef[] = [
  // TIER 1 (Dễ)
  {
    id: 't1_1', tier: 1,
    text: "Rừng ngập mặn thường được ví như lá chắn gì của vùng ven biển?",
    answers: [
      { id: 'A', text: "Lá chắn nhiệt", isCorrect: false },
      { id: 'B', text: "Lá chắn bão lũ", isCorrect: true },
      { id: 'C', text: "Lá chắn phóng xạ", isCorrect: false },
      { id: 'D', text: "Lá chắn thiên thạch", isCorrect: false },
    ],
    expertAdvice: "Rừng ngập mặn với hệ thống rễ đan xen chằng chịt chính là bức tường thành tự nhiên vững chắc nhất bảo vệ con người khỏi bão lũ và triều cường. Chắc chắn là B."
  },
  {
    id: 't1_2', tier: 1,
    text: "Hành động nào sau đây giúp giảm thiểu rác thải nhựa đại dương một cách đơn giản nhất mỗi ngày?",
    answers: [
      { id: 'A', text: "Dùng ống hút nhựa", isCorrect: false },
      { id: 'B', text: "Thả bóng bay lên trời", isCorrect: false },
      { id: 'C', text: "Mang theo bình nước cá nhân", isCorrect: true },
      { id: 'D', text: "Đốt rác tại nhà", isCorrect: false },
    ],
    expertAdvice: "Chỉ một hành động nhỏ là mang bình nước cá nhân, bạn đã cứu hàng ngàn sinh vật biển khỏi việc nuốt phải rác thải nhựa. Đáp án C."
  },
  {
    id: 't1_3', tier: 1,
    text: "Loài động vật nào được chọn làm biểu tượng của Quỹ Quốc tế Bảo vệ Thiên nhiên (WWF)?",
    answers: [
      { id: 'A', text: "Gấu trúc khổng lồ", isCorrect: true },
      { id: 'B', text: "Hổ Bengal", isCorrect: false },
      { id: 'C', text: "Tê giác sừng sừng", isCorrect: false },
      { id: 'D', text: "Cá heo xanh", isCorrect: false },
    ],
    expertAdvice: "Biểu tượng này được thiết kế từ năm 1961 và đã trở thành lời nhắc nhở toàn cầu về việc bảo vệ các loài nguy cấp. Đó là Gấu trúc khổng lồ."
  },
  {
    id: 't1_4', tier: 1,
    text: "Đâu là nguồn năng lượng tái tạo, thân thiện với môi trường?",
    answers: [
      { id: 'A', text: "Than đá", isCorrect: false },
      { id: 'B', text: "Dầu mỏ", isCorrect: false },
      { id: 'C', text: "Khí tự nhiên", isCorrect: false },
      { id: 'D', text: "Năng lượng mặt trời", isCorrect: true },
    ],
    expertAdvice: "Năng lượng mặt trời là nguồn năng lượng vô tận và sạch sẽ. Đáp án D."
  },
  {
    id: 't1_5', tier: 1,
    text: "Rừng Amazon, khu rừng nhiệt đới lớn nhất thế giới, thường được mệnh danh là gì của Trái Đất?",
    answers: [
      { id: 'A', text: "Trái tim", isCorrect: false },
      { id: 'B', text: "Mạch máu", isCorrect: false },
      { id: 'C', text: "Lá phổi xanh", isCorrect: true },
      { id: 'D', text: "Khối óc", isCorrect: false },
    ],
    expertAdvice: "Rừng Amazon tạo ra khoảng 20% lượng oxy cho Trái Đất, nên nó được gọi là Lá phổi xanh."
  },
  {
    id: 't1_6', tier: 1,
    text: "Ngày Môi trường Thế giới được kỷ niệm vào ngày nào hàng năm?",
    answers: [
      { id: 'A', text: "5 tháng 6", isCorrect: true },
      { id: 'B', text: "22 tháng 4", isCorrect: false },
      { id: 'C', text: "22 tháng 3", isCorrect: false },
      { id: 'D', text: "5 tháng 5", isCorrect: false },
    ],
    expertAdvice: "Ngày Môi trường Thế giới được Liên Hợp Quốc chọn là ngày 5 tháng 6 hàng năm. Đáp án A."
  },
  {
    id: 't1_7', tier: 1,
    text: "Nguồn nước ngọt chiếm khoảng bao nhiêu phần trăm tổng lượng nước trên Trái Đất?",
    answers: [
      { id: 'A', text: "Khoảng 3%", isCorrect: true },
      { id: 'B', text: "Khoảng 10%", isCorrect: false },
      { id: 'C', text: "Khoảng 30%", isCorrect: false },
      { id: 'D', text: "Khoảng 50%", isCorrect: false },
    ],
    expertAdvice: "Dù Trái Đất được bao phủ bởi nước, nhưng nước ngọt chỉ chiếm một phần rất nhỏ, khoảng 3%. Đáp án A."
  },
  {
    id: 't1_8', tier: 1,
    text: "Loại rác thải nào sau đây mất nhiều thời gian phân hủy nhất trong tự nhiên?",
    answers: [
      { id: 'A', text: "Lõi táo", isCorrect: false },
      { id: 'B', text: "Giấy báo", isCorrect: false },
      { id: 'C', text: "Túi nilon", isCorrect: false },
      { id: 'D', text: "Chai thủy tinh", isCorrect: true },
    ],
    expertAdvice: "Chai thủy tinh có thể mất hàng triệu năm để phân hủy hoàn toàn trong tự nhiên. Đáp án D."
  },
  {
    id: 't1_9', tier: 1,
    text: "Khí nào sau đây cần thiết cho sự hô hấp của con người và động vật?",
    answers: [
      { id: 'A', text: "Carbon dioxide (CO2)", isCorrect: false },
      { id: 'B', text: "Oxy (O2)", isCorrect: true },
      { id: 'C', text: "Nitơ (N2)", isCorrect: false },
      { id: 'D', text: "Methane (CH4)", isCorrect: false },
    ],
    expertAdvice: "Oxy là khí duy trì sự sống và quá trình hô hấp. Đáp án B."
  },
  {
    id: 't1_10', tier: 1,
    text: "Hành động nào sau đây KHÔNG phải là bảo vệ môi trường?",
    answers: [
      { id: 'A', text: "Trồng cây gây rừng", isCorrect: false },
      { id: 'B', text: "Sử dụng túi vải thay túi nilon", isCorrect: false },
      { id: 'C', text: "Xả nước thải chưa xử lý ra sông", isCorrect: true },
      { id: 'D', text: "Tái chế rác thải", isCorrect: false },
    ],
    expertAdvice: "Xả nước thải chưa xử lý sẽ gây ô nhiễm nguồn nước nghiêm trọng. Đáp án C."
  },

  // TIER 2 (Trung bình)
  {
    id: 't2_1', tier: 2,
    text: "Hiện tượng Trái Đất nóng lên chủ yếu do sự gia tăng của loại khí nào trong khí quyển?",
    answers: [
      { id: 'A', text: "Khí Oxy (O2)", isCorrect: false },
      { id: 'B', text: "Khí Nitơ (N2)", isCorrect: false },
      { id: 'C', text: "Khí Carbon dioxide (CO2)", isCorrect: true },
      { id: 'D', text: "Khí Hydro (H2)", isCorrect: false },
    ],
    expertAdvice: "Sự gia tăng CO2 từ các hoạt động công nghiệp đang tạo ra hiệu ứng nhà kính. Đáp án C."
  },
  {
    id: 't2_2', tier: 2,
    text: "Trong chuỗi thức ăn tự nhiên, nếu một loài động vật ăn thịt đầu bảng biến mất, điều gì sẽ xảy ra đầu tiên?",
    answers: [
      { id: 'A', text: "Rừng sẽ phát triển mạnh hơn", isCorrect: false },
      { id: 'B', text: "Động vật ăn cỏ sẽ tăng vọt về số lượng", isCorrect: true },
      { id: 'C', text: "Khí hậu sẽ thay đổi", isCorrect: false },
      { id: 'D', text: "Nguồn nước sẽ cạn kiệt", isCorrect: false },
    ],
    expertAdvice: "Thiếu đi kẻ săn mồi, động vật ăn cỏ sẽ sinh sôi mất kiểm soát và ăn trụi thảm thực vật. Đáp án B."
  },
  {
    id: 't2_3', tier: 2,
    text: "Vườn quốc gia nào sau đây của Việt Nam được UNESCO công nhận là Di sản Thiên nhiên Thế giới?",
    answers: [
      { id: 'A', text: "Vườn quốc gia Cúc Phương", isCorrect: false },
      { id: 'B', text: "Vườn quốc gia Phong Nha - Kẻ Bàng", isCorrect: true },
      { id: 'C', text: "Vườn quốc gia Ba Vì", isCorrect: false },
      { id: 'D', text: "Vườn quốc gia Cát Tiên", isCorrect: false },
    ],
    expertAdvice: "Đó là Phong Nha - Kẻ Bàng với hệ thống hang động kỳ vĩ và đa dạng sinh học bậc nhất. Đáp án B."
  },
  {
    id: 't2_4', tier: 2,
    text: "'Giờ Trái Đất' là sự kiện quốc tế kêu gọi người dân làm gì trong vòng 60 phút?",
    answers: [
      { id: 'A', text: "Trồng một cây xanh", isCorrect: false },
      { id: 'B', text: "Ngừng sử dụng xe máy", isCorrect: false },
      { id: 'C', text: "Tắt đèn và các thiết bị điện không cần thiết", isCorrect: true },
      { id: 'D', text: "Không sử dụng mạng internet", isCorrect: false },
    ],
    expertAdvice: "Một hành động nhỏ nhưng khi hàng tỷ người cùng làm, chúng ta đang cho Trái Đất một nhịp nghỉ ngơi. Đó là tắt đèn. Đáp án C."
  },
  {
    id: 't2_5', tier: 2,
    text: "Loài rùa biển nào sau đây thường về đẻ trứng tại Côn Đảo, Việt Nam và đang được bảo vệ nghiêm ngặt?",
    answers: [
      { id: 'A', text: "Rùa da", isCorrect: false },
      { id: 'B', text: "Đồi mồi", isCorrect: false },
      { id: 'C', text: "Vích (Rùa xanh)", isCorrect: true },
      { id: 'D', text: "Quản đồng", isCorrect: false },
    ],
    expertAdvice: "Đó là loài Vích, hay còn gọi là Rùa xanh. Côn Đảo là bãi đẻ lớn nhất của chúng ở Việt Nam. Đáp án C."
  },
  {
    id: 't2_6', tier: 2,
    text: "Tầng ozone trong khí quyển có vai trò chính là gì?",
    answers: [
      { id: 'A', text: "Giữ ấm cho Trái Đất", isCorrect: false },
      { id: 'B', text: "Ngăn chặn tia cực tím (UV) từ Mặt Trời", isCorrect: true },
      { id: 'C', text: "Tạo ra mưa", isCorrect: false },
      { id: 'D', text: "Cung cấp oxy cho sinh vật", isCorrect: false },
    ],
    expertAdvice: "Tầng ozone hoạt động như một tấm khiên bảo vệ Trái Đất khỏi các tia cực tím độc hại. Đáp án B."
  },
  {
    id: 't2_7', tier: 2,
    text: "Hiện tượng El Nino thường gây ra hệ quả gì cho khí hậu toàn cầu?",
    answers: [
      { id: 'A', text: "Làm lạnh bất thường bề mặt đại dương", isCorrect: false },
      { id: 'B', text: "Làm nóng bất thường bề mặt đại dương", isCorrect: true },
      { id: 'C', text: "Gây ra kỷ băng hà nhỏ", isCorrect: false },
      { id: 'D', text: "Làm giảm lượng mưa trên toàn thế giới", isCorrect: false },
    ],
    expertAdvice: "El Nino là hiện tượng nóng lên dị thường của lớp nước biển bề mặt ở khu vực xích đạo trung tâm và Đông Thái Bình Dương. Đáp án B."
  },
  {
    id: 't2_8', tier: 2,
    text: "Rạn san hô lớn nhất thế giới (Great Barrier Reef) nằm ở quốc gia nào?",
    answers: [
      { id: 'A', text: "Indonesia", isCorrect: false },
      { id: 'B', text: "Philippines", isCorrect: false },
      { id: 'C', text: "Úc (Australia)", isCorrect: true },
      { id: 'D', text: "Brazil", isCorrect: false },
    ],
    expertAdvice: "Rạn san hô Great Barrier Reef nằm ở ngoài khơi bờ biển Queensland, Úc. Đáp án C."
  },
  {
    id: 't2_9', tier: 2,
    text: "Đâu là nguyên nhân chính gây ra sự suy giảm tầng ozone?",
    answers: [
      { id: 'A', text: "Khí CO2", isCorrect: false },
      { id: 'B', text: "Khí CFC (Chlorofluorocarbon)", isCorrect: true },
      { id: 'C', text: "Khí Methane", isCorrect: false },
      { id: 'D', text: "Hơi nước", isCorrect: false },
    ],
    expertAdvice: "Khí CFC, từng được dùng nhiều trong tủ lạnh và bình xịt, là thủ phạm chính phá hủy tầng ozone. Đáp án B."
  },
  {
    id: 't2_10', tier: 2,
    text: "Năng lượng địa nhiệt được khai thác từ nguồn nào?",
    answers: [
      { id: 'A', text: "Nhiệt lượng từ Mặt Trời", isCorrect: false },
      { id: 'B', text: "Sức nóng từ sâu trong lòng đất", isCorrect: true },
      { id: 'C', text: "Sự phân hủy của rác thải", isCorrect: false },
      { id: 'D', text: "Chuyển động của thủy triều", isCorrect: false },
    ],
    expertAdvice: "Địa nhiệt là nguồn năng lượng sạch được lấy từ sức nóng bên trong lõi Trái Đất. Đáp án B."
  },

  // TIER 3 (Khó)
  {
    id: 't3_1', tier: 3,
    text: "Vi hạt nhựa (Microplastics) nguy hiểm cho sinh vật biển vì chúng có kích thước nhỏ hơn bao nhiêu?",
    answers: [
      { id: 'A', text: "5 mm", isCorrect: true },
      { id: 'B', text: "10 mm", isCorrect: false },
      { id: 'C', text: "15 mm", isCorrect: false },
      { id: 'D', text: "20 mm", isCorrect: false },
    ],
    expertAdvice: "Vi hạt nhựa nhỏ hơn 5mm, dễ dàng lọt vào chuỗi thức ăn và cuối cùng là đi vào cơ thể con người. Đáp án A."
  },
  {
    id: 't3_2', tier: 3,
    text: "Khái niệm 'Dấu chân Carbon' (Carbon Footprint) dùng để chỉ điều gì?",
    answers: [
      { id: 'A', text: "Dấu chân của động vật trên than đá", isCorrect: false },
      { id: 'B', text: "Diện tích rừng bị cháy trong một năm", isCorrect: false },
      { id: 'C', text: "Lượng khí thải nhà kính do một cá nhân/tổ chức tạo ra", isCorrect: true },
      { id: 'D', text: "Lượng than đá được khai thác trên toàn cầu", isCorrect: false },
    ],
    expertAdvice: "Mỗi chúng ta đều để lại 'dấu chân' này, và nhiệm vụ của chiến binh môi trường là làm cho dấu chân ấy càng mờ càng tốt. Đáp án C."
  },
  {
    id: 't3_3', tier: 3,
    text: "Loài động vật đặc hữu nào của Việt Nam được mệnh danh là 'Kỳ lân châu Á' và đang đứng trước nguy cơ tuyệt chủng cực kỳ nguy cấp?",
    answers: [
      { id: 'A', text: "Voọc chà vá chân nâu", isCorrect: false },
      { id: 'B', text: "Sao la", isCorrect: true },
      { id: 'C', text: "Sếu đầu đỏ", isCorrect: false },
      { id: 'D', text: "Mang lớn", isCorrect: false },
    ],
    expertAdvice: "Kỳ lân châu Á được phát hiện lần đầu tại Vũ Quang, Hà Tĩnh năm 1992. Đó chắc chắn là Sao la! Đáp án B."
  },
  {
    id: 't3_4', tier: 3,
    text: "Công nghệ 'Thu hồi và lưu trữ Carbon' (CCS) nhằm mục đích gì trong việc bảo vệ môi trường?",
    answers: [
      { id: 'A', text: "Chuyển hóa CO2 thành Oxy", isCorrect: false },
      { id: 'B', text: "Hút CO2 từ khí quyển và chôn lấp dưới lòng đất", isCorrect: true },
      { id: 'C', text: "Sử dụng CO2 để chạy động cơ xe hơi", isCorrect: false },
      { id: 'D', text: "Đóng băng CO2 ở hai cực Trái Đất", isCorrect: false },
    ],
    expertAdvice: "Công nghệ này đang được kỳ vọng sẽ cứu vãn bầu khí quyển của chúng ta bằng cách hút và chôn lấp CO2. Đáp án B."
  },
  {
    id: 't3_5', tier: 3,
    text: "Hiệp định quốc tế quan trọng nhất nhằm giảm phát thải khí nhà kính, giữ nhiệt độ toàn cầu không tăng quá 1.5 độ C, được ký kết tại thành phố nào vào năm 2015?",
    answers: [
      { id: 'A', text: "Kyoto", isCorrect: false },
      { id: 'B', text: "Copenhagen", isCorrect: false },
      { id: 'C', text: "Paris", isCorrect: true },
      { id: 'D', text: "Geneva", isCorrect: false },
    ],
    expertAdvice: "Năm 1997 là Kyoto, 2009 là Copenhagen. Nhưng phải đến năm 2015, thế giới mới đạt được thỏa thuận bước ngoặt tại Paris. Đáp án C."
  },
  {
    id: 't3_6', tier: 3,
    text: "Nghị định thư Montreal (1987) được ký kết nhằm giải quyết vấn đề môi trường toàn cầu nào?",
    answers: [
      { id: 'A', text: "Biến đổi khí hậu", isCorrect: false },
      { id: 'B', text: "Suy giảm tầng ozone", isCorrect: true },
      { id: 'C', text: "Bảo vệ động vật hoang dã", isCorrect: false },
      { id: 'D', text: "Rác thải nhựa đại dương", isCorrect: false },
    ],
    expertAdvice: "Nghị định thư Montreal là một trong những hiệp ước môi trường thành công nhất, nhằm loại bỏ các chất làm suy giảm tầng ozone. Đáp án B."
  },
  {
    id: 't3_7', tier: 3,
    text: "Đại dương hấp thụ khoảng bao nhiêu phần trăm lượng khí CO2 do con người thải ra?",
    answers: [
      { id: 'A', text: "Khoảng 10%", isCorrect: false },
      { id: 'B', text: "Khoảng 30%", isCorrect: true },
      { id: 'C', text: "Khoảng 50%", isCorrect: false },
      { id: 'D', text: "Khoảng 70%", isCorrect: false },
    ],
    expertAdvice: "Đại dương là một bể chứa carbon khổng lồ, hấp thụ khoảng 30% lượng CO2, giúp làm chậm quá trình biến đổi khí hậu nhưng lại gây axit hóa đại dương. Đáp án B."
  },
  {
    id: 't3_8', tier: 3,
    text: "Hiện tượng 'tẩy trắng san hô' (Coral bleaching) xảy ra chủ yếu do nguyên nhân nào?",
    answers: [
      { id: 'A', text: "Nhiệt độ nước biển tăng cao", isCorrect: true },
      { id: 'B', text: "San hô bị thiếu thức ăn", isCorrect: false },
      { id: 'C', text: "Độ mặn của nước biển giảm", isCorrect: false },
      { id: 'D', text: "Sự tấn công của các loài cá", isCorrect: false },
    ],
    expertAdvice: "Khi nước biển quá ấm, san hô sẽ trục xuất tảo cộng sinh sống trong mô của chúng, khiến chúng mất màu và dần chết đi. Đáp án A."
  },
  {
    id: 't3_9', tier: 3,
    text: "Khái niệm 'Kinh tế tuần hoàn' (Circular Economy) tập trung vào nguyên tắc cốt lõi nào?",
    answers: [
      { id: 'A', text: "Sản xuất - Sử dụng - Vứt bỏ", isCorrect: false },
      { id: 'B', text: "Tối đa hóa lợi nhuận bằng mọi giá", isCorrect: false },
      { id: 'C', text: "Loại bỏ rác thải và tái tạo hệ sinh thái tự nhiên", isCorrect: true },
      { id: 'D', text: "Chỉ sử dụng năng lượng hóa thạch", isCorrect: false },
    ],
    expertAdvice: "Kinh tế tuần hoàn hướng tới việc thiết kế để không có rác thải, giữ vật liệu trong vòng tuần hoàn và tái tạo tự nhiên. Đáp án C."
  },
  {
    id: 't3_10', tier: 3,
    text: "Quốc gia nào hiện đang là quốc gia phát thải lượng khí nhà kính lớn nhất thế giới?",
    answers: [
      { id: 'A', text: "Hoa Kỳ", isCorrect: false },
      { id: 'B', text: "Ấn Độ", isCorrect: false },
      { id: 'C', text: "Nga", isCorrect: false },
      { id: 'D', text: "Trung Quốc", isCorrect: true },
    ],
    expertAdvice: "Với sự phát triển công nghiệp mạnh mẽ, Trung Quốc hiện là quốc gia phát thải CO2 lớn nhất thế giới. Đáp án D."
  }
];

type GameState = 'intro' | 'playing' | 'won' | 'lost';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [hiddenAnswers, setHiddenAnswers] = useState<string[]>([]);
  
  // Lifelines
  const [used5050, setUsed5050] = useState(false);
  const [usedExpert, setUsedExpert] = useState(false);
  const [usedAudience, setUsedAudience] = useState(false);
  
  // Modals
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const [audienceVotes, setAudienceVotes] = useState<Record<string, number>>({});

  const currentQuestion = currentQuestions[currentQuestionIndex];
  
  const getSafePoints = () => {
    if (currentQuestionIndex >= 10) return POINTS[9];
    if (currentQuestionIndex >= 5) return POINTS[4];
    return 0;
  };

  const generateQuestionsForGame = () => {
    // Get history from localStorage
    let history: string[][] = [];
    try {
      const stored = localStorage.getItem('gameHistory');
      if (stored) history = JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    // Flatten history to get used IDs
    const usedIds = new Set(history.flat());

    const getUnused = (tier: number, count: number) => {
      let available = QUESTION_BANK.filter(q => q.tier === tier && !usedIds.has(q.id));
      // If not enough unused questions, fallback to all questions in that tier
      if (available.length < count) {
        available = QUESTION_BANK.filter(q => q.tier === tier);
      }
      // Shuffle
      return available.sort(() => 0.5 - Math.random()).slice(0, count);
    };

    const selectedTier1 = getUnused(1, 5);
    const selectedTier2 = getUnused(2, 5);
    const selectedTier3 = getUnused(3, 5);

    const selected = [...selectedTier1, ...selectedTier2, ...selectedTier3];
    
    // Save to history (keep only last 3 games)
    const newHistory = [selected.map(q => q.id), ...history].slice(0, 3);
    localStorage.setItem('gameHistory', JSON.stringify(newHistory));

    return selected.map((q, index) => ({
      ...q,
      points: POINTS[index]
    }));
  };

  const startGame = () => {
    const questions = generateQuestionsForGame();
    setCurrentQuestions(questions);
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowCorrect(false);
    setHiddenAnswers([]);
    setUsed5050(false);
    setUsedExpert(false);
    setUsedAudience(false);
  };

  const handleAnswerSelect = (answerId: string) => {
    if (selectedAnswer || showCorrect) return;
    
    setSelectedAnswer(answerId);
    
    // Simulate suspense
    setTimeout(() => {
      setShowCorrect(true);
      
      const isCorrect = currentQuestion.answers.find(a => a.id === answerId)?.isCorrect;
      
      setTimeout(() => {
        if (isCorrect) {
          if (currentQuestionIndex === currentQuestions.length - 1) {
            setGameState('won');
          } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowCorrect(false);
            setHiddenAnswers([]);
          }
        } else {
          setGameState('lost');
        }
      }, 3000);
    }, 2000);
  };

  const handle5050 = () => {
    if (used5050 || selectedAnswer) return;
    
    const incorrectAnswers = currentQuestion.answers.filter(a => !a.isCorrect);
    // Shuffle and pick 2
    const shuffled = [...incorrectAnswers].sort(() => 0.5 - Math.random());
    const toHide = [shuffled[0].id, shuffled[1].id];
    
    setHiddenAnswers(toHide);
    setUsed5050(true);
  };

  const handleExpert = () => {
    if (usedExpert || selectedAnswer) return;
    setShowExpertModal(true);
    setUsedExpert(true);
  };

  const handleAudience = () => {
    if (usedAudience || selectedAnswer) return;
    
    // Generate fake votes
    const correctId = currentQuestion.answers.find(a => a.isCorrect)!.id;
    let remaining = 100;
    const votes: Record<string, number> = {};
    
    // Correct gets majority (50-80%)
    const correctVote = Math.floor(Math.random() * 30) + 50;
    votes[correctId] = correctVote;
    remaining -= correctVote;
    
    const otherIds = currentQuestion.answers.filter(a => a.id !== correctId && !hiddenAnswers.includes(a.id)).map(a => a.id);
    
    otherIds.forEach((id, index) => {
      if (index === otherIds.length - 1) {
        votes[id] = remaining;
      } else {
        const vote = Math.floor(Math.random() * remaining);
        votes[id] = vote;
        remaining -= vote;
      }
    });
    
    // If some answers are hidden by 50:50, they get 0
    hiddenAnswers.forEach(id => {
      votes[id] = 0;
    });
    
    setAudienceVotes(votes);
    setShowAudienceModal(true);
    setUsedAudience(true);
  };

  if (gameState === 'intro') {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-emerald-900 to-slate-900 flex flex-col items-center justify-center text-white p-4 overflow-hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center max-w-3xl"
        >
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Leaf className="w-20 h-20 text-emerald-400" />
              <TreePine className="w-10 h-10 text-emerald-600 absolute bottom-0 right-0" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            AI LÀ TRIỆU PHÚ
          </h1>
          <h2 className="text-xl md:text-2xl font-light mb-6 tracking-widest text-emerald-200">
            CHIẾN BINH BẢO VỆ MÔI TRƯỜNG SỐNG
          </h2>
          <p className="text-base md:text-lg text-slate-300 mb-8 leading-relaxed px-4">
            Nơi kiến thức không chỉ mang lại tiền thưởng mà còn là chìa khóa để bảo vệ Hành tinh Xanh. 
            Vượt qua 15 câu hỏi để trở thành "Đại sứ Xanh". Mỗi điểm số bạn giành được sẽ được quy đổi thành cây xanh thực tế!
          </p>
          <button 
            onClick={startGame}
            className="group relative px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold rounded-full overflow-hidden transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="flex items-center gap-2">
              <Play className="w-5 h-5 fill-current" /> BẮT ĐẦU HÀNH TRÌNH
            </span>
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'won' || gameState === 'lost') {
    const earnedPoints = gameState === 'won' ? POINTS[14] : getSafePoints();
    
    return (
      <div className="h-screen w-full bg-gradient-to-b from-emerald-900 to-slate-900 flex flex-col items-center justify-center text-white p-4 overflow-hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-xl w-full bg-slate-800/50 p-8 rounded-3xl border border-emerald-500/30 backdrop-blur-sm"
        >
          {gameState === 'won' ? (
            <>
              <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2 text-yellow-400">ĐẠI SỨ XANH!</h1>
              <p className="text-xl mb-6 text-emerald-100">
                Tuyệt vời! Bạn đã chinh phục toàn bộ 15 câu hỏi.
              </p>
            </>
          ) : (
            <>
              <Leaf className="w-24 h-24 text-slate-500 mx-auto mb-4 opacity-50" />
              <h1 className="text-3xl font-bold mb-2 text-slate-300">HÀNH TRÌNH KHÉP LẠI</h1>
              <p className="text-lg mb-6 text-slate-400">
                Bạn đã dừng bước ở câu hỏi số {currentQuestionIndex + 1}.
              </p>
            </>
          )}
          
          <div className="bg-emerald-900/50 rounded-2xl p-4 mb-6 border border-emerald-500/50">
            <p className="text-base text-emerald-200 mb-1">Số cây xanh bạn đã đóng góp:</p>
            <p className="text-5xl font-bold text-emerald-400">{earnedPoints.toLocaleString()}</p>
            <p className="text-xs mt-2 text-emerald-300/70">
              Nhà tài trợ sẽ gieo trồng số cây này tại các khu rừng phòng hộ.
            </p>
          </div>
          
          <button 
            onClick={startGame}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-full transition-colors flex items-center gap-2 mx-auto"
          >
            <Home className="w-4 h-4" /> CHƠI LẠI TỪ ĐẦU
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#0a192f] text-white flex flex-col font-sans overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="h-16 shrink-0 px-4 flex justify-between items-center border-b border-emerald-900/50 bg-slate-900/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.5)]">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-wider text-emerald-400 hidden sm:inline">AI LÀ TRIỆU PHÚ</span>
        </div>
        
        {/* Lifelines */}
        <div className="flex gap-2 sm:gap-4">
          <button 
            onClick={handle5050}
            disabled={used5050 || selectedAnswer !== null}
            className={`w-12 h-9 rounded-full flex items-center justify-center font-bold border-2 text-sm transition-all ${
              used5050 
                ? 'border-slate-700 text-slate-600 bg-slate-800/50 cursor-not-allowed' 
                : 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/20 hover:shadow-[0_0_10px_rgba(16,185,129,0.4)] cursor-pointer'
            }`}
          >
            50:50
          </button>
          <button 
            onClick={handleExpert}
            disabled={usedExpert || selectedAnswer !== null}
            className={`w-12 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
              usedExpert 
                ? 'border-slate-700 text-slate-600 bg-slate-800/50 cursor-not-allowed' 
                : 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/20 hover:shadow-[0_0_10px_rgba(16,185,129,0.4)] cursor-pointer'
            }`}
          >
            <Phone className="w-4 h-4" />
          </button>
          <button 
            onClick={handleAudience}
            disabled={usedAudience || selectedAnswer !== null}
            className={`w-12 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
              usedAudience 
                ? 'border-slate-700 text-slate-600 bg-slate-800/50 cursor-not-allowed' 
                : 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/20 hover:shadow-[0_0_10px_rgba(16,185,129,0.4)] cursor-pointer'
            }`}
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 z-10">
        {/* Main Game Area */}
        <main className="flex-1 flex flex-col justify-center p-2 sm:p-4 min-w-0 max-w-5xl mx-auto w-full">
          
          {/* Question Box */}
          <motion.div 
            key={`q-${currentQuestion?.id}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative mb-4 sm:mb-6 mt-4"
          >
            <div className="absolute inset-0 bg-emerald-900/40 border-2 border-emerald-500/50 rounded-xl transform skew-x-[-5deg] shadow-[0_0_20px_rgba(16,185,129,0.15)]" />
            <div className="relative p-4 sm:p-6 text-center">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a192f] px-3 text-emerald-400 font-bold text-xs tracking-widest border border-emerald-500/50 rounded-full">
                CÂU HỎI {currentQuestionIndex + 1}
              </span>
              <h2 className="text-lg sm:text-2xl font-medium leading-snug text-emerald-50">
                {currentQuestion?.text}
              </h2>
            </div>
          </motion.div>

          {/* Answers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {currentQuestion?.answers.map((answer, index) => {
              const isHidden = hiddenAnswers.includes(answer.id);
              const isSelected = selectedAnswer === answer.id;
              const isCorrect = answer.isCorrect;
              
              let bgClass = "bg-slate-800/60 border-emerald-500/30 hover:bg-emerald-900/60 hover:border-emerald-400";
              let textClass = "text-slate-200";
              
              if (isSelected && !showCorrect) {
                bgClass = "bg-yellow-600/80 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]";
                textClass = "text-white";
              } else if (showCorrect) {
                if (isCorrect) {
                  bgClass = "bg-emerald-600/90 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)] animate-pulse";
                  textClass = "text-white font-bold";
                } else if (isSelected) {
                  bgClass = "bg-red-600/80 border-red-400";
                  textClass = "text-white";
                } else {
                  bgClass = "bg-slate-800/30 border-slate-700/50 opacity-50";
                }
              }

              return (
                <button
                  key={answer.id}
                  onClick={() => handleAnswerSelect(answer.id)}
                  disabled={isHidden || selectedAnswer !== null}
                  className={`relative p-3 sm:p-4 text-left rounded-lg border-2 transition-all duration-300 transform ${
                    isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  } ${bgClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold text-lg w-6">{answer.id}:</span>
                    <span className={`text-sm sm:text-base ${textClass}`}>{answer.text}</span>
                  </div>
                  
                  {/* Decorator lines */}
                  <div className="absolute top-1/2 -left-1.5 w-3 h-[2px] bg-emerald-500/50 hidden sm:block" />
                  <div className="absolute top-1/2 -right-1.5 w-3 h-[2px] bg-emerald-500/50 hidden sm:block" />
                </button>
              );
            })}
          </div>
        </main>

        {/* Sidebar / Progress */}
        <aside className="w-full lg:w-64 shrink-0 bg-slate-900/80 border-t lg:border-t-0 lg:border-l border-emerald-900/50 p-3 sm:p-4 flex flex-col-reverse lg:flex-col justify-end overflow-y-auto max-h-48 lg:max-h-none">
          <div className="flex flex-col gap-1">
            {[...currentQuestions].reverse().map((q, idx) => {
              const originalIndex = currentQuestions.length - 1 - idx;
              const isCurrent = originalIndex === currentQuestionIndex;
              const isPassed = originalIndex < currentQuestionIndex;
              const isMilestone = originalIndex === 4 || originalIndex === 9 || originalIndex === 14;
              
              return (
                <div 
                  key={q.id}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-md transition-all text-sm ${
                    isCurrent 
                      ? 'bg-emerald-600 text-white font-bold shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                      : isPassed 
                        ? 'text-emerald-500/50' 
                        : isMilestone 
                          ? 'text-yellow-400 font-semibold' 
                          : 'text-emerald-200/70'
                  }`}
                >
                  <span className="w-6">{originalIndex + 1}</span>
                  <span className="flex items-center gap-1">
                    <Leaf className={`w-3 h-3 ${isCurrent ? 'fill-current' : ''}`} />
                    {q.points.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showExpertModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-800 border border-emerald-500/50 rounded-2xl p-6 max-w-md w-full shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            >
              <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Kết nối Chuyên gia</h3>
                  <p className="text-emerald-400 text-xs">Viện Sinh thái học</p>
                </div>
              </div>
              <p className="text-base text-slate-300 leading-relaxed italic mb-6">
                "{currentQuestion?.expertAdvice}"
              </p>
              <button 
                onClick={() => setShowExpertModal(false)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
              >
                Cảm ơn Chuyên gia
              </button>
            </motion.div>
          </motion.div>
        )}

        {showAudienceModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-800 border border-emerald-500/50 rounded-2xl p-6 max-w-md w-full shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Tham vấn Cộng đồng</h3>
                  <p className="text-emerald-400 text-xs">Khán giả trường quay</p>
                </div>
              </div>
              
              <div className="flex items-end justify-around h-40 mb-6 gap-2">
                {['A', 'B', 'C', 'D'].map(id => {
                  const percentage = audienceVotes[id] || 0;
                  return (
                    <div key={id} className="flex flex-col items-center gap-1 w-full">
                      <span className="text-emerald-300 font-bold text-sm">{percentage}%</span>
                      <div className="w-full bg-slate-700 rounded-t-sm relative flex-1 flex items-end">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="w-full bg-emerald-500 rounded-t-sm"
                        />
                      </div>
                      <span className="text-white font-bold">{id}</span>
                    </div>
                  );
                })}
              </div>
              
              <button 
                onClick={() => setShowAudienceModal(false)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

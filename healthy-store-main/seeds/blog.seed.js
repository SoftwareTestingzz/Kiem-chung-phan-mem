const Blog = require('../models/blog.model');
const slugify = require('slugify');

const blogsData = [
    {
        title: "10 lợi ích tuyệt vời của Omega-3 đối với sức khỏe",
        content: `<p>Omega-3 là loại axit béo thiết yếu mà cơ thể chúng ta không tự tổng hợp được, mà cần phải bổ sung qua thực phẩm hoặc thực phẩm chức năng. Dưới đây là 10 lợi ích sức khỏe quan trọng nhất của Omega-3.</p>

<h2>1. Bảo vệ sức khỏe tim mạch</h2>
<p>Omega-3 giúp giảm triglyceride trong máu, hạ huyết áp nhẹ, giảm nguy cơ hình thành cục máu đông và giảm nguy cơ mắc bệnh tim mạch.</p>

<h2>2. Hỗ trợ sức khỏe não bộ</h2>
<p>DHA - một loại Omega-3 - chiếm khoảng 40% lượng axit béo đa không bão hòa trong não. Bổ sung đầy đủ DHA giúp cải thiện trí nhớ, tăng khả năng tập trung và giảm nguy cơ mắc bệnh Alzheimer.</p>

<h2>3. Giảm viêm trong cơ thể</h2>
<p>Omega-3 có đặc tính chống viêm mạnh mẽ, giúp giảm các triệu chứng viêm khớp dạng thấp, giảm đau và cứng khớp buổi sáng.</p>

<h2>4. Cải thiện sức khỏe mắt</h2>
<p>DHA là thành phần chính của võng mạc mắt. Thiếu DHA có thể gây ra các vấn đề về thị lực. Bổ sung Omega-3 giúp giảm nguy cơ thoái hóa điểm vàng.</p>

<h2>5. Hỗ trợ sức khỏe tâm thần</h2>
<p>Nghiên cứu cho thấy Omega-3 có thể giúp giảm các triệu chứng trầm cảm và rối loạn lo âu, cải thiện tâm trạng và chất lượng cuộc sống.</p>

<h2>Lời khuyên</h2>
<p>Bạn nên bổ sung Omega-3 từ cá hồi, cá thu, cá ngừ hoặc sử dụng thực phẩm chức năng dầu cá chất lượng cao. Liều khuyến cáo là 1-2g EPA+DHA/ngày.</p>`,
        thumbnail: "https://placehold.co/800x500/4ade80/ffffff?text=Omega-3+Benefits"
    },
    {
        title: "Tại sao Vitamin D3 lại quan trọng hơn bạn nghĩ?",
        content: `<p>Vitamin D3 thường được gọi là "vitamin ánh nắng" vì cơ thể có thể tự tổng hợp khi tiếp xúc với ánh nắng mặt trời. Tuy nhiên, phần lớn người Việt Nam lại thiếu hụt loại vitamin quan trọng này.</p>

<h2>Vitamin D3 là gì?</h2>
<p>Vitamin D3 (cholecalciferol) là dạng vitamin D được tổng hợp tự nhiên khi da tiếp xúc với tia UVB từ ánh nắng mặt trời. Đây là dạng hoạt động mạnh nhất và được hấp thụ tốt nhất bởi cơ thể.</p>

<h2>Tại sao thiếu Vitamin D3 lại phổ biến?</h2>
<ul>
<li>Thói quen ở trong nhà nhiều, ít tiếp xúc ánh nắng</li>
<li>Sử dụng kem chống nắng liên tục</li>
<li>Chế độ ăn ít thực phẩm chứa Vitamin D</li>
<li>Người da màu hấp thụ ít vitamin D từ ánh nắng hơn</li>
</ul>

<h2>Lợi ích của Vitamin D3</h2>
<p>Vitamin D3 đóng vai trò quan trọng trong việc hấp thụ canxi và phospho, duy trì xương chắc khỏe, tăng cường hệ miễn dịch, hỗ trợ sức khỏe tim mạch và giảm nguy cơ mắc một số bệnh mãn tính.</p>

<h2>Liều khuyến cáo</h2>
<p>Người lớn nên bổ sung 1000-2000 IU Vitamin D3 mỗi ngày. Tuy nhiên, nên xét nghiệm máu để xác định mức độ thiếu hụt trước khi dùng liều cao hơn.</p>`,
        thumbnail: "https://placehold.co/800x500/86efac/ffffff?text=Vitamin+D3"
    },
    {
        title: "Hướng dẫn chọn Whey Protein phù hợp cho người mới tập gym",
        content: `<p>Bước vào thế giới gym và thực phẩm bổ sung có thể khá choáng ngợp, đặc biệt khi phải lựa chọn giữa hàng chục loại Whey Protein khác nhau. Bài viết này sẽ giúp bạn hiểu rõ và chọn đúng sản phẩm.</p>

<h2>Các loại Whey Protein chính</h2>

<h3>1. Whey Protein Concentrate (WPC)</h3>
<p>Chứa 70-80% protein, còn lại là chất béo và lactose. Đây là loại phổ biến nhất và có giá thành hợp lý nhất. Phù hợp cho người mới bắt đầu.</p>

<h3>2. Whey Protein Isolate (WPI)</h3>
<p>Chứa trên 90% protein, ít chất béo và lactose hơn WPC. Hấp thụ nhanh hơn, phù hợp cho người không dung nạp lactose.</p>

<h3>3. Whey Protein Hydrolysate (WPH)</h3>
<p>Protein đã được thủy phân một phần, hấp thụ nhanh nhất. Thường được dùng trong sản phẩm y tế hoặc cho vận động viên chuyên nghiệp.</p>

<h2>Làm thế nào để chọn?</h2>
<p>Người mới tập: Chọn WPC với hàm lượng protein 20-25g/khẩu phần, ít chất phụ gia. Người không dung nạp lactose: Chọn WPI. Muốn giảm mỡ tăng cơ: Ưu tiên WPI với ít carb và chất béo.</p>

<h2>Thời điểm uống Whey Protein</h2>
<ul>
<li>Sau tập 30-60 phút: Hiệu quả nhất</li>
<li>Buổi sáng sau thức dậy: Bổ sung protein sau khi cơ thể nhịn ăn qua đêm</li>
<li>Giữa các bữa ăn: Duy trì tổng lượng protein trong ngày</li>
</ul>`,
        thumbnail: "https://placehold.co/800x500/34d399/ffffff?text=Whey+Protein+Guide"
    },
    {
        title: "5 loại trà thảo dược giúp ngủ ngon và giảm căng thẳng",
        content: `<p>Trong nhịp sống hiện đại hối hả, stress và mất ngủ đang trở thành vấn đề phổ biến. Trà thảo dược là giải pháp tự nhiên, an toàn và hiệu quả để giúp bạn thư giãn và cải thiện giấc ngủ.</p>

<h2>1. Trà Hoa Cúc (Chamomile)</h2>
<p>Hoa cúc chứa apigenin - một flavonoid có tác dụng gắn kết với các thụ thể benzodiazepine trong não, tạo hiệu ứng an thần nhẹ nhàng. Uống 1 tách trà hoa cúc ấm 30 phút trước khi ngủ giúp ngủ nhanh và ngủ sâu hơn.</p>

<h2>2. Trà Lạc Tiên (Passionflower)</h2>
<p>Lạc tiên là thảo dược truyền thống được dùng để giảm lo âu và cải thiện giấc ngủ. Nghiên cứu cho thấy lạc tiên có thể giúp tăng thời gian GABA trong não, giúp cơ thể và tâm trí thư giãn.</p>

<h2>3. Trà Oải Hương (Lavender)</h2>
<p>Mùi hương lavender nổi tiếng với tác dụng thư giãn. Uống trà lavender hoặc đơn giản là hít hương thơm từ tinh dầu lavender có thể giúp giảm nhịp tim, giảm huyết áp và tạo cảm giác bình tĩnh.</p>

<h2>4. Trà Valerian Root</h2>
<p>Rễ cây nữ lang (valerian) đã được dùng từ thời Hy Lạp cổ đại để điều trị mất ngủ và lo âu. Uống đều đặn trong 2-4 tuần cho kết quả tốt nhất.</p>

<h2>5. Trà Atiso</h2>
<p>Trà atiso vừa thanh nhiệt, giải độc gan, vừa có tác dụng nhẹ nhàng giúp thư giãn tinh thần. Là lựa chọn phổ biến trong văn hóa Việt Nam, đặc biệt là atiso Đà Lạt.</p>`,
        thumbnail: "https://placehold.co/800x500/6ee7b7/ffffff?text=Herbal+Tea"
    },
    {
        title: "Glucosamine và sức khỏe xương khớp: Sự thật bạn cần biết",
        content: `<p>Đau khớp, thoái hóa khớp là những vấn đề phổ biến ở người trung niên và người cao tuổi. Glucosamine đã được nghiên cứu rộng rãi như một giải pháp hỗ trợ sức khỏe khớp tự nhiên.</p>

<h2>Glucosamine là gì?</h2>
<p>Glucosamine là một hợp chất tự nhiên có trong sụn khớp của cơ thể. Nó đóng vai trò quan trọng trong việc xây dựng và duy trì sụn khớp - lớp đệm bảo vệ các đầu xương khi vận động.</p>

<h2>Tại sao cần bổ sung?</h2>
<p>Khi lão hóa, cơ thể sản xuất ít glucosamine hơn dẫn đến sụn khớp bị mài mòn. Điều này gây ra đau khớp, cứng khớp và cuối cùng là thoái hóa khớp. Bổ sung glucosamine từ bên ngoài có thể giúp làm chậm quá trình này.</p>

<h2>Kết hợp với Chondroitin</h2>
<p>Glucosamine thường được kết hợp với Chondroitin sulfate để tăng hiệu quả. Chondroitin giúp sụn khớp giữ nước, tăng độ đàn hồi và giảm viêm.</p>

<h2>Lời khuyên sử dụng</h2>
<p>Liều thông thường là 1500mg Glucosamine + 1200mg Chondroitin/ngày. Cần dùng ít nhất 2-3 tháng liên tục để thấy hiệu quả rõ ràng. Người bị dị ứng hải sản cần thận trọng vì Glucosamine thường được chiết xuất từ vỏ giáp xác.</p>`,
        thumbnail: "https://placehold.co/800x500/a7f3d0/333333?text=Glucosamine+Joints"
    }
];

module.exports = async () => {
    for (const blogData of blogsData) {
        const slug = slugify(blogData.title, { lower: true, strict: true, locale: 'vi' });
        const existing = await Blog.findOne({ slug });
        if (!existing) {
            await Blog.create({ ...blogData, slug });
            console.log(`  ✓ Đã tạo blog: ${blogData.title}`);
        } else {
            console.log(`  ~ Blog đã tồn tại: ${blogData.title}`);
        }
    }
};

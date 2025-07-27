import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t mt-4">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Thông tin chi tiết
                        </h3>
                        <div className="space-y-3">
                            <a
                                href="#"
                                className="block text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Về chúng tôi
                            </a>
                            <a
                                href="#"
                                className="block text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Chính sách bảo mật
                            </a>
                            <a
                                href="#"
                                className="block text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Liên hệ với chúng tôi
                            </a>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="h-4 w-4" />
                                <span>+92 321 3333 333</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Kết nối với chúng tôi{" "}
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 bg-transparent bg-blue-500 text-slate-200 hover:bg-blue-600 transition-colors"
                                    >
                                        <Facebook className="h-4 w-4 " />
                                        <span className="sr-only">
                                            Facebook
                                        </span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white hover:bg-gradient-to-br transition-colors"
                                    >
                                        <Instagram className="h-4 w-4" />
                                        <span className="sr-only">
                                            Instagram
                                        </span>
                                    </Button>
                                </div>
                                <span className="text-sm text-gray-600">
                                    Theo dõi chúng tôi trên mạng xã hội
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Bản tin
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Đăng ký nhận bản tin của chúng tôi để nhận thông tin
                            cập nhật và ưu đãi mới nhất.
                        </p>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    className="flex-1"
                                />
                                <Button className="px-6">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Đăng ký theo dõi
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                                Chúng tôi tôn trọng quyền riêng tư của bạn. Hãy
                                hủy đăng ký bất cứ lúc nào.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                        © {new Date().getFullYear()} BEAUTIBOT. Mọi quyền được
                        bảo lưu.
                    </div>
                    <div className="flex gap-6 text-sm">
                        <a
                            href="#"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Chính sách bảo mật
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Điều khoản dịch vụ
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Liên hệ với chúng tôi
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

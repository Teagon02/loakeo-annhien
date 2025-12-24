import React from "react";
import Container from "../Container";
import { SubTitle } from "../ui/text";

const GoogleMap = () => {
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2859.898492848555!2d106.82568336924147!3d11.005192599940077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dd06145c68bf%3A0x20176ab6dbea7cb9!2sShop%20Loa%20K%C3%A9o%20An%20Nhi%C3%AAn!5e0!3m2!1svi!2s!4v1766588540573!5m2!1svi!2s";

  return (
    <section className="w-full bg-white border-t border-gray-200 py-8 md:py-12">
      <Container>
        <div className="space-y-6">
          <div className="text-center">
            <SubTitle className="text-2xl md:text-3xl mb-2">
              Vị trí cửa hàng
            </SubTitle>
            <p className="text-gray-600 text-sm md:text-base">
              Ghé thăm cửa hàng của chúng tôi để xem sản phẩm trực tiếp
            </p>
          </div>
          <div className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <div className="relative w-full aspect-video min-h-[300px] md:min-h-[450px]">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default GoogleMap;

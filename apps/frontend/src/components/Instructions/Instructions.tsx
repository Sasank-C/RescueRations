import { Card, Flex } from "@chakra-ui/react";
import { Step } from "./Step";

const Steps = [
  {
    icon: "/steps/1.svg",
    title: "Purchase Near-Expiry Products",
    description:
      "Buy near-expiry food items at a discount to reduce waste and save money.",
  },
  {
    icon: "/steps/2.svg",
    title: "Upload the receipt",
    description:
      "Scan and upload your receipt to verify your purchase of near-expiry products. Our AI will validate the details.",
  },
  {
    icon: "/steps/3.svg",
    title: "Earn rewards",
    description:
      "Get rewarded with B3TR tokens for every verified purchase and donation of near-expiry food items.",
  },
];

export const Instructions = () => {
  return (
    <Card mt={3} w={"full"}>
      <Flex p={{ base: 4 }} w="100%" direction={{ base: "column", md: "row" }}>
        {Steps.map((step, index) => (
          <Step key={index} {...step} />
        ))}
      </Flex>
    </Card>
  );
};

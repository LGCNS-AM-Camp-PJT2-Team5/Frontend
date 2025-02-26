import { useState } from "react";
import InterestCompanies from "./interest_company/InterestCompanies";
import ActiveTabBar from "../../components/admin/ActiveTabBar";
import Profile from "./profiles/Profile";

/**
 * 마이페이지 컴포넌트 (회원 정보 조회/수정 & 관심 기업 선택)
 */
export default function MyPage() {
    const [selectedTab, setSelectedTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "회원 정보 조회/수정" },
        { id: "interestCompanies", label: "관심 기업 선택" }
    ];

    return (
        <div>
            {/* 탭 UI */}
            <ActiveTabBar tabs={tabs} onSelect={setSelectedTab} />

            {/* 선택된 탭에 따라 컴포넌트 렌더링 */}
            {selectedTab === "profile" && <Profile />}
            {selectedTab === "interestCompanies" && <InterestCompanies />}
        </div>
    );
}

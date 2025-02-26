import React, { useState } from "react";
import axios from "axios";
import Title from "../../components/common/Title";
import "./Signup.css";
import { InputLabel } from "../../components/common/InputLabel";
import defatultProfile from "../../assets/images/Defalt_Profile_Image.png";
import PurpleBtn from "../../components/common/PurpleBtn";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        passwordConfirm: "",
        profilePicture: null,
    });

    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState("");
    const [errors, setErrors] = useState({}); // 에러 메시지 상태 추가
    const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // 입력 시 해당 필드의 에러 초기화
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, profilePicture: file });

        if (file) {
            setFileName(file.name);
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        } else {
            setFileName("");
            setPreview(null);
        }
    };

    const handleValidationErrors = (reason) => {
        if (!reason) return;
        const reasonList = reason.split(", ").filter(Boolean);
        setErrors((prevErrors) => ({ ...prevErrors, general: reasonList.join("\n") }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // 기존 에러 초기화

        const { name, username, password, passwordConfirm } = formData;

        if (!name || !username || !password || !passwordConfirm) {
            setErrors({ general: "모든 필드를 입력해주세요." });
            return;
        }
        if (password !== passwordConfirm) {
            setErrors({ general: "비밀번호가 일치하지 않습니다." });
            return;
        }

        const formDataToSend = new FormData();
        const signupRequestDto = { name, username, password, passwordConfirm };

        formDataToSend.append(
            "signupRequestDto",
            new Blob([JSON.stringify(signupRequestDto)], { type: "application/json" })
        );

        if (formData.profilePicture) {
            formDataToSend.append("file", formData.profilePicture);
        }

        try {
            const response = await axios.post(
                "http://localhost:8072/jobbotdari-user/api/auth/signup",
                formDataToSend,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.status === 200) {
                alert("회원가입 성공!");
                navigate("/");
            } else {
                setErrors({ general: response.data.message || "회원가입 실패" });
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.response) {
                const { code, message, reason } = error.response.data;
                switch (code) {
                    case "USER_001": // 아이디 중복
                        setErrors((prevErrors) => ({ ...prevErrors, general: "이미 사용 중인 아이디입니다." }));
                        break;
                    case "USER_002": // 비밀번호 불일치
                        setErrors((prevErrors) => ({ ...prevErrors, general: "비밀번호와 비밀번호 확인이 일치하지 않습니다." }));
                        break;
                    case "G011": // 유효성 검사 실패
                        handleValidationErrors(reason);
                        break;
                    default:
                        setErrors((prevErrors) => ({ ...prevErrors, general: message || "서버와 통신 중 문제가 발생했습니다." }));
                }
            } else {
                setErrors({ general: "네트워크 오류가 발생했습니다. 다시 시도해주세요." });
            }
        }
    };

    return (
        <div className="signup_form_container">
            <Title mainTitle="Sign Up"/>
            <div className="signup_form_wrapper">
                <form className="signup_form" onSubmit={handleSubmit}>
                    <div className="display_flex">
                        <InputLabel
                            label="이름"
                            name="name"
                            placeholder="이름을 입력해주세요"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <InputLabel
                            label="아이디"
                            name="username"
                            placeholder="아이디를 입력해주세요"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="display_flex">
                        <InputLabel
                            label="비밀번호"
                            name="password"
                            type="password"
                            placeholder="비밀번호를 입력해주세요"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <InputLabel
                            label="비밀번호 확인"
                            name="passwordConfirm"
                            type="password"
                            placeholder="비밀번호를 입력해주세요"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                        />
                    </div>
                    <InputLabel
                        label="프로필 사진"
                        name="profilePicture"
                        type="file"
                        placeholder="파일 이름"
                        value={fileName}
                        onFileChange={handleFileChange}
                    />
                    
                    <PurpleBtn text="회원가입" type="submit" width="100%"/>

                    {/* 회원가입 버튼 하단에 에러 메시지 출력 */}
                    {errors.general && (
                        <div className="error_message_container">
                            <p className="error_message">{errors.general}</p>
                        </div>
                    )}
                </form>
                <div className="signup_profile" style={{ marginTop: "20px" }}>
                    <img src={preview || defatultProfile} alt="미리보기"/>
                </div>
            </div>
        </div>
    );
}

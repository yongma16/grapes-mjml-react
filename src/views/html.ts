export const htmlString=`<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>loading_box</title>
		<style>
			body {
				margin:0;
				padding:0;
				/* background: url(./background.png); */
				background: #000000;
			}

			.box {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				width: 300px;
				height: 300px;
				border: 2px solid transparent;
				box-sizing: border-box;
			}

			.box span {
				position: absolute;
				width: 100px;
				height: 100px;
				background: #01ffff;
				box-shadow: 0 2px 20px #01ffff;
				animation: animate 1s ease-in-out infinite;
			}
			.box span:nth-child(1)
			{
				animation-delay: 0s;
				background: #ffff00;
				box-shadow: 0 2px 20px #ffff00;
			}
			.box span:nth-child(2)
			{
				animation-delay: -0.67s;
				background: #01ffff;
				box-shadow: 0 2px 20px #01ffff;
			}
			.box span:nth-child(3)
			{
				animation-delay: 0.67s;
				background: #ffaa00;
				box-shadow: 0 2px 20px #ffaa00;
			}

			@keyframes animate {
				0% {
					left: 0;
					top: 0;
				}

				25% {
					left: 50%;
					top: 0;
				}

				50% {
					left: 50%;
					top: 50%;
				}

				75% {
					left: 0;
					top: 50%;
				}

				100% {
					left: 0;
					top: 0;
				}
			}
		</style>
	</head>
	<body>
		<div class="box">
			<span></span>
			<span></span>
			<span></span>
		</div>
	</body>
</html>
`
